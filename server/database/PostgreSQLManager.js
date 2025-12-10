const { Pool } = require('pg');

class PostgreSQLManager {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Create PostgreSQL connection pool
      this.pool = new Pool({
        user: process.env.POSTGRES_USER || 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        database: process.env.POSTGRES_DB || 'ecommerce_analytics',
        password: process.env.POSTGRES_PASSWORD || 'password',
        port: process.env.POSTGRES_PORT || 5432,
        max: 20, // Max number of clients in pool
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.isConnected = true;
      console.log('✅ PostgreSQL connection established');
      
      // Initialize analytics tables
      await this.initializeTables();
      
      return this.pool;
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error.message);
      console.log('🔄 Continuing without PostgreSQL analytics...');
      this.isConnected = false;
      return null;
    }
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      console.log('👋 PostgreSQL disconnected');
    }
  }

  async initializeTables() {
    if (!this.isConnected) return;

    const tables = {
      // User analytics table
      user_analytics: `
        CREATE TABLE IF NOT EXISTS user_analytics (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          session_id VARCHAR(255),
          action_type VARCHAR(100) NOT NULL,
          page_url TEXT,
          user_agent TEXT,
          ip_address INET,
          metadata JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (user_id),
          INDEX (action_type),
          INDEX (created_at)
        )
      `,

      // Product analytics table
      product_analytics: `
        CREATE TABLE IF NOT EXISTS product_analytics (
          id SERIAL PRIMARY KEY,
          product_id VARCHAR(255) NOT NULL,
          action_type VARCHAR(100) NOT NULL,
          user_id VARCHAR(255),
          session_id VARCHAR(255),
          quantity INTEGER DEFAULT 1,
          price DECIMAL(10,2),
          metadata JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (product_id),
          INDEX (action_type),
          INDEX (created_at)
        )
      `,

      // Order analytics table  
      order_analytics: `
        CREATE TABLE IF NOT EXISTS order_analytics (
          id SERIAL PRIMARY KEY,
          order_id VARCHAR(255) NOT NULL,
          user_id VARCHAR(255) NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          items_count INTEGER NOT NULL,
          payment_method VARCHAR(100),
          delivery_location TEXT,
          order_status VARCHAR(50),
          processing_time INTEGER, -- in minutes
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (order_id),
          INDEX (user_id),
          INDEX (created_at)
        )
      `,

      // Performance metrics table
      performance_metrics: `
        CREATE TABLE IF NOT EXISTS performance_metrics (
          id SERIAL PRIMARY KEY,
          endpoint VARCHAR(255) NOT NULL,
          method VARCHAR(10) NOT NULL,
          response_time INTEGER NOT NULL, -- in milliseconds
          status_code INTEGER NOT NULL,
          user_id VARCHAR(255),
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (endpoint),
          INDEX (created_at),
          INDEX (status_code)
        )
      `,

      // Real-time sessions table
      active_sessions: `
        CREATE TABLE IF NOT EXISTS active_sessions (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) UNIQUE NOT NULL,
          user_id VARCHAR(255),
          ip_address INET,
          user_agent TEXT,
          last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          page_count INTEGER DEFAULT 1,
          cart_items INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (session_id),
          INDEX (user_id),
          INDEX (last_activity)
        )
      `
    };

    try {
      for (const [tableName, query] of Object.entries(tables)) {
        await this.pool.query(query);
        console.log(`✅ Table ${tableName} ready`);
      }
      console.log('🗃️ PostgreSQL analytics tables initialized');
    } catch (error) {
      console.error('❌ Error initializing tables:', error);
    }
  }

  // User Analytics Methods
  async logUserAction(userId, actionType, metadata = {}) {
    if (!this.isConnected) return;

    try {
      const query = `
        INSERT INTO user_analytics (user_id, action_type, page_url, user_agent, ip_address, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      
      await this.pool.query(query, [
        userId,
        actionType,
        metadata.page_url || null,
        metadata.user_agent || null,
        metadata.ip_address || null,
        JSON.stringify(metadata)
      ]);
    } catch (error) {
      console.error('Error logging user action:', error);
    }
  }

  async getUserAnalytics(userId, days = 30) {
    if (!this.isConnected) return null;

    try {
      const query = `
        SELECT 
          action_type,
          COUNT(*) as count,
          DATE_TRUNC('day', created_at) as day
        FROM user_analytics
        WHERE user_id = $1 
          AND created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY action_type, day
        ORDER BY day DESC
      `;
      
      const result = await this.pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  }

  // Product Analytics Methods
  async logProductAction(productId, actionType, userId = null, metadata = {}) {
    if (!this.isConnected) return;

    try {
      const query = `
        INSERT INTO product_analytics (product_id, action_type, user_id, session_id, quantity, price, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      
      await this.pool.query(query, [
        productId,
        actionType,
        userId,
        metadata.session_id || null,
        metadata.quantity || 1,
        metadata.price || null,
        JSON.stringify(metadata)
      ]);
    } catch (error) {
      console.error('Error logging product action:', error);
    }
  }

  async getProductAnalytics(days = 30) {
    if (!this.isConnected) return null;

    try {
      const query = `
        SELECT 
          product_id,
          action_type,
          COUNT(*) as count,
          SUM(quantity) as total_quantity,
          AVG(price) as avg_price
        FROM product_analytics
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY product_id, action_type
        ORDER BY count DESC
      `;
      
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting product analytics:', error);
      return null;
    }
  }

  // Order Analytics Methods
  async logOrder(orderData) {
    if (!this.isConnected) return;

    try {
      const query = `
        INSERT INTO order_analytics (
          order_id, user_id, total_amount, items_count, 
          payment_method, delivery_location, order_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      
      await this.pool.query(query, [
        orderData.order_id,
        orderData.user_id,
        orderData.total_amount,
        orderData.items_count,
        orderData.payment_method || null,
        orderData.delivery_location || null,
        orderData.order_status || 'pending'
      ]);
    } catch (error) {
      console.error('Error logging order:', error);
    }
  }

  async getOrderAnalytics(days = 30) {
    if (!this.isConnected) return null;

    try {
      const query = `
        SELECT 
          DATE_TRUNC('day', created_at) as day,
          COUNT(*) as orders_count,
          SUM(total_amount) as total_revenue,
          AVG(total_amount) as avg_order_value,
          SUM(items_count) as total_items
        FROM order_analytics
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY day
        ORDER BY day DESC
      `;
      
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting order analytics:', error);
      return null;
    }
  }

  // Performance Monitoring
  async logPerformance(endpoint, method, responseTime, statusCode, metadata = {}) {
    if (!this.isConnected) return;

    try {
      const query = `
        INSERT INTO performance_metrics (
          endpoint, method, response_time, status_code, 
          user_id, ip_address, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      
      await this.pool.query(query, [
        endpoint,
        method,
        responseTime,
        statusCode,
        metadata.user_id || null,
        metadata.ip_address || null,
        metadata.user_agent || null
      ]);
    } catch (error) {
      console.error('Error logging performance:', error);
    }
  }

  async getPerformanceMetrics(days = 7) {
    if (!this.isConnected) return null;

    try {
      const query = `
        SELECT 
          endpoint,
          method,
          COUNT(*) as request_count,
          AVG(response_time) as avg_response_time,
          MIN(response_time) as min_response_time,
          MAX(response_time) as max_response_time,
          COUNT(*) FILTER (WHERE status_code >= 400) as error_count
        FROM performance_metrics
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY endpoint, method
        ORDER BY request_count DESC
      `;
      
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return null;
    }
  }

  // Session Management
  async updateSession(sessionId, metadata = {}) {
    if (!this.isConnected) return;

    try {
      const query = `
        INSERT INTO active_sessions (session_id, user_id, ip_address, user_agent, cart_items)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (session_id)
        DO UPDATE SET
          last_activity = CURRENT_TIMESTAMP,
          page_count = active_sessions.page_count + 1,
          cart_items = $5
      `;
      
      await this.pool.query(query, [
        sessionId,
        metadata.user_id || null,
        metadata.ip_address || null,
        metadata.user_agent || null,
        metadata.cart_items || 0
      ]);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }

  async getActiveSessions() {
    if (!this.isConnected) return null;

    try {
      const query = `
        SELECT COUNT(*) as total_sessions,
               COUNT(*) FILTER (WHERE user_id IS NOT NULL) as authenticated_sessions,
               COUNT(*) FILTER (WHERE user_id IS NULL) as guest_sessions,
               AVG(page_count) as avg_page_views
        FROM active_sessions
        WHERE last_activity >= NOW() - INTERVAL '1 hour'
      `;
      
      const result = await this.pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting active sessions:', error);
      return null;
    }
  }

  // Health check
  async ping() {
    if (!this.isConnected) return false;
    
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get database stats
  async getStats() {
    if (!this.isConnected) {
      return { connected: false, error: 'PostgreSQL not connected' };
    }

    try {
      const tableStats = await this.pool.query(`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
      `);

      const dbSize = await this.pool.query(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `);

      return {
        connected: this.isConnected,
        tables: tableStats.rows,
        database_size: dbSize.rows[0].size,
        pool_stats: {
          total_count: this.pool.totalCount,
          idle_count: this.pool.idleCount,
          waiting_count: this.pool.waitingCount
        }
      };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}

// Create singleton instance
const postgresManager = new PostgreSQLManager();

module.exports = postgresManager;