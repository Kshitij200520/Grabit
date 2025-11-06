# DRAW.IO XML CODE FOR HLD & LLD DIAGRAMS

## 📋 INSTRUCTIONS:
1. Copy XML code below
2. Open draw.io (https://app.diagrams.net/)
3. File → Import from → Device
4. Paste XML code
5. Diagram will be created automatically

---

## 🏗️ HLD - SYSTEM ARCHITECTURE XML

```xml
<mxfile host="app.diagrams.net" modified="2024-01-01T00:00:00.000Z" agent="draw.io" version="22.1.16" etag="version" type="device">
  <diagram name="HLD" id="hld-diagram">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    
    <!-- Title -->
    <mxCell id="title" value="E-COMMERCE SYSTEM - HIGH LEVEL DESIGN" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=20;fontStyle=1;fontColor=#2196F3;" vertex="1" parent="1">
      <mxGeometry x="200" y="20" width="400" height="30" as="geometry"/>
    </mxCell>
    
    <!-- Client Tier -->
    <mxCell id="client" value="CLIENT TIER&#xa;&#xa;React Frontend&#xa;• Components&#xa;• State Management&#xa;• UI/UX&#xa;• Routing" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#4CAF50;strokeColor=#2E7D32;fontColor=#FFFFFF;fontSize=14;fontStyle=1;align=center;" vertex="1" parent="1">
      <mxGeometry x="50" y="100" width="200" height="150" as="geometry"/>
    </mxCell>
    
    <!-- Server Tier -->
    <mxCell id="server" value="SERVER TIER&#xa;&#xa;Node.js/Express&#xa;• REST APIs&#xa;• Business Logic&#xa;• Authentication&#xa;• Middleware" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#2196F3;strokeColor=#1565C0;fontColor=#FFFFFF;fontSize=14;fontStyle=1;align=center;" vertex="1" parent="1">
      <mxGeometry x="300" y="100" width="200" height="150" as="geometry"/>
    </mxCell>
    
    <!-- Data Tier -->
    <mxCell id="database" value="DATA TIER&#xa;&#xa;MongoDB&#xa;• Collections&#xa;• Indexes&#xa;• Aggregation&#xa;• Transactions" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF9800;strokeColor=#F57C00;fontColor=#FFFFFF;fontSize=14;fontStyle=1;align=center;" vertex="1" parent="1">
      <mxGeometry x="550" y="100" width="200" height="150" as="geometry"/>
    </mxCell>
    
    <!-- Connections -->
    <mxCell id="conn1" value="HTTP/HTTPS" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=3;strokeColor=#4CAF50;fontColor=#2E7D32;fontStyle=1;" edge="1" parent="1" source="client" target="server">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    
    <mxCell id="conn2" value="Database Queries" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=3;strokeColor=#2196F3;fontColor=#1565C0;fontStyle=1;" edge="1" parent="1" source="server" target="database">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    
    <!-- Components Box -->
    <mxCell id="components" value="SYSTEM COMPONENTS" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#9C27B0;strokeColor=#7B1FA2;fontColor=#FFFFFF;fontSize=16;fontStyle=1;align=center;" vertex="1" parent="1">
      <mxGeometry x="50" y="300" width="700" height="40" as="geometry"/>
    </mxCell>
    
    <!-- Frontend Components -->
    <mxCell id="frontend" value="🎨 FRONTEND&#xa;• Product Catalog&#xa;• Shopping Cart&#xa;• Order Management&#xa;• User Interface" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E91E63;strokeColor=#C2185B;fontColor=#FFFFFF;fontSize=12;align=left;" vertex="1" parent="1">
      <mxGeometry x="50" y="360" width="200" height="100" as="geometry"/>
    </mxCell>
    
    <!-- Backend Components -->
    <mxCell id="backend" value="🔧 BACKEND&#xa;• REST APIs&#xa;• Authentication&#xa;• Business Logic&#xa;• Data Processing" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#673AB7;strokeColor=#512DA8;fontColor=#FFFFFF;fontSize=12;align=left;" vertex="1" parent="1">
      <mxGeometry x="300" y="360" width="200" height="100" as="geometry"/>
    </mxCell>
    
    <!-- Database Components -->
    <mxCell id="dbcomponents" value="🗄️ DATABASE&#xa;• User Data&#xa;• Product Catalog&#xa;• Cart & Orders&#xa;• Payment Records" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#795548;strokeColor=#5D4037;fontColor=#FFFFFF;fontSize=12;align=left;" vertex="1" parent="1">
      <mxGeometry x="550" y="360" width="200" height="100" as="geometry"/>
    </mxCell>
    
    <!-- User Flow -->
    <mxCell id="userflow" value="USER FLOW DIAGRAM" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF5722;strokeColor=#D84315;fontColor=#FFFFFF;fontSize=16;fontStyle=1;align=center;" vertex="1" parent="1">
      <mxGeometry x="50" y="500" width="700" height="40" as="geometry"/>
    </mxCell>
    
    <!-- Flow Steps -->
    <mxCell id="browse" value="Browse&#xa;Products" style="ellipse;whiteSpace=wrap;html=1;fillColor=#4CAF50;strokeColor=#2E7D32;fontColor=#FFFFFF;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="80" y="560" width="100" height="60" as="geometry"/>
    </mxCell>
    
    <mxCell id="select" value="Select&#xa;Product" style="ellipse;whiteSpace=wrap;html=1;fillColor=#2196F3;strokeColor=#1565C0;fontColor=#FFFFFF;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="230" y="560" width="100" height="60" as="geometry"/>
    </mxCell>
    
    <mxCell id="cart" value="Add Cart&#xa;/Buy Now" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FF9800;strokeColor=#F57C00;fontColor=#FFFFFF;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="380" y="560" width="100" height="60" as="geometry"/>
    </mxCell>
    
    <mxCell id="checkout" value="Checkout&#xa;& Pay" style="ellipse;whiteSpace=wrap;html=1;fillColor=#9C27B0;strokeColor=#7B1FA2;fontColor=#FFFFFF;fontSize=12;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="530" y="560" width="100" height="60" as="geometry"/>
    </mxCell>
    
    <!-- Flow Arrows -->
    <mxCell id="arrow1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=3;strokeColor=#4CAF50;" edge="1" parent="1" source="browse" target="select">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    
    <mxCell id="arrow2" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=3;strokeColor=#2196F3;" edge="1" parent="1" source="select" target="cart">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    
    <mxCell id="arrow3" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=3;strokeColor=#FF9800;" edge="1" parent="1" source="cart" target="checkout">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    
    </root>
  </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 🔧 LLD - DETAILED ARCHITECTURE XML

```xml
<mxfile host="app.diagrams.net" modified="2024-01-01T00:00:00.000Z" agent="draw.io" version="22.1.16" etag="version" type="device">
  <diagram name="LLD" id="lld-diagram">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    
    <!-- Title -->
    <mxCell id="title" value="E-COMMERCE SYSTEM - LOW LEVEL DESIGN" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=20;fontStyle=1;fontColor=#E91E63;" vertex="1" parent="1">
      <mxGeometry x="200" y="20" width="400" height="30" as="geometry"/>
    </mxCell>
    
    <!-- Frontend Architecture -->
    <mxCell id="frontend-title" value="FRONTEND ARCHITECTURE" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#9C27B0;strokeColor=#7B1FA2;fontColor=#FFFFFF;fontSize=16;fontStyle=1;align=center;" vertex="1" parent="1">
      <mxGeometry x="50" y="70" width="300" height="40" as="geometry"/>
    </mxCell>
    
    <!-- Frontend Structure -->
    <mxCell id="src" value="src/" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#4CAF50;strokeColor=#2E7D32;fontColor=#FFFFFF;fontSize=14;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="50" y="120" width="60" height="30" as="geometry"/>
    </mxCell>
    
    <mxCell id="components" value="components/&#xa;• ProductCard.js&#xa;• CartItem.js&#xa;• OrderItem.js&#xa;• ThemeToggle.js" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#2196F3;strokeColor=#1565C0;fontColor=#FFFFFF;fontSize=10;align=left;" vertex="1" parent="1">
      <mxGeometry x="50" y="160" width="130" height="80" as="geometry"/>
    </mxCell>
    
    <mxCell id="pages" value="pages/&#xa;• Home.js&#xa;• Products.js&#xa;• Cart.js&#xa;• Orders.js" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF9800;strokeColor=#F57C00;fontColor=#FFFFFF;fontSize=10;align=left;" vertex="1" parent="1">
      <mxGeometry x="200" y="160" width="130" height="80" as="geometry"/>
    </mxCell>
    
    <mxCell id="services" value="services/&#xa;• api.js&#xa;• productService.js&#xa;• cartService.js" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E91E63;strokeColor=#C2185B;fontColor=#FFFFFF;fontSize=10;align=left;" vertex="1" parent="1">
      <mxGeometry x="50" y="250" width="130" height="70" as="geometry"/>
    </mxCell>
    
    <mxCell id="contexts" value="contexts/&#xa;• ThemeContext.js&#xa;• CartContext.js" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#673AB7;strokeColor=#512DA8;fontColor=#FFFFFF;fontSize=10;align=left;" vertex="1" parent="1">
      <mxGeometry x="200" y="250" width="130" height="70" as="geometry"/>
    </mxCell>
    
    <!-- Backend Architecture -->
    <mxCell id="backend-title" value="BACKEND ARCHITECTURE" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#795548;strokeColor=#5D4037;fontColor=#FFFFFF;fontSize=16;fontStyle=1;align=center;" vertex="1" parent="1">
      <mxGeometry x="450" y="70" width="300" height="40" as="geometry"/>
    </mxCell>
    
    <!-- Backend Structure -->
    <mxCell id="server" value="server/" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#607D8B;strokeColor=#455A64;fontColor=#FFFFFF;fontSize=14;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="450" y="120" width="60" height="30" as="geometry"/>
    </mxCell>
    
    <mxCell id="routes" value="routes/&#xa;• products.js&#xa;• cart.js&#xa;• orders.js&#xa;• users.js" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF5722;strokeColor=#D84315;fontColor=#FFFFFF;fontSize=10;align=left;" vertex="1" parent="1">
      <mxGeometry x="450" y="160" width="130" height="80" as="geometry"/>
    </mxCell>
    
    <mxCell id="models" value="models/&#xa;• Product.js&#xa;• Cart.js&#xa;• Order.js&#xa;• User.js" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#009688;strokeColor=#00695C;fontColor=#FFFFFF;fontSize=10;align=left;" vertex="1" parent="1">
      <mxGeometry x="600" y="160" width="130" height="80" as="geometry"/>
    </mxCell>
    
    <mxCell id="middleware" value="middleware/&#xa;• auth.js&#xa;• validation.js" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#3F51B5;strokeColor=#303F9F;fontColor=#FFFFFF;fontSize=10;align=left;" vertex="1" parent="1">
      <mxGeometry x="450" y="250" width="130" height="70" as="geometry"/>
    </mxCell>
    
    <mxCell id="backend-services" value="services/&#xa;• paymentService.js&#xa;• deliveryService.js" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFC107;strokeColor=#FF8F00;fontColor=#000000;fontSize=10;align=left;" vertex="1" parent="1">
      <mxGeometry x="600" y="250" width="130" height="70" as="geometry"/>
    </mxCell>
    
    <!-- Database Design -->
    <mxCell id="db-title" value="DATABASE SCHEMA DESIGN" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#37474F;strokeColor=#263238;fontColor=#FFFFFF;fontSize=16;fontStyle=1;align=center;" vertex="1" parent="1">
      <mxGeometry x="50" y="350" width="700" height="40" as="geometry"/>
    </mxCell>
    
    <!-- Database Tables -->
    <mxCell id="users-table" value="USERS&#xa;• _id&#xa;• name&#xa;• email&#xa;• password&#xa;• createdAt" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#4CAF50;strokeColor=#2E7D32;fontColor=#FFFFFF;fontSize=11;align=left;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="70" y="410" width="100" height="100" as="geometry"/>
    </mxCell>
    
    <mxCell id="products-table" value="PRODUCTS&#xa;• _id&#xa;• name&#xa;• price&#xa;• category&#xa;• stock&#xa;• image" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#2196F3;strokeColor=#1565C0;fontColor=#FFFFFF;fontSize=11;align=left;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="200" y="410" width="100" height="100" as="geometry"/>
    </mxCell>
    
    <mxCell id="cart-table" value="CART&#xa;• _id&#xa;• user&#xa;• items[]&#xa;• totalAmount&#xa;• createdAt" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF9800;strokeColor=#F57C00;fontColor=#FFFFFF;fontSize=11;align=left;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="330" y="410" width="100" height="100" as="geometry"/>
    </mxCell>
    
    <mxCell id="orders-table" value="ORDERS&#xa;• _id&#xa;• user&#xa;• orderItems[]&#xa;• totalPrice&#xa;• status" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#9C27B0;strokeColor=#7B1FA2;fontColor=#FFFFFF;fontSize=11;align=left;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="460" y="410" width="100" height="100" as="geometry"/>
    </mxCell>
    
    <mxCell id="payments-table" value="PAYMENTS&#xa;• _id&#xa;• orderId&#xa;• amount&#xa;• status&#xa;• method" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E91E63;strokeColor=#C2185B;fontColor=#FFFFFF;fontSize=11;align=left;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="590" y="410" width="100" height="100" as="geometry"/>
    </mxCell>
    
    <!-- Relationships -->
    <mxCell id="rel1" value="1:N" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#4CAF50;fontColor=#2E7D32;fontStyle=1;" edge="1" parent="1" source="users-table" target="orders-table">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    
    <mxCell id="rel2" value="1:1" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#2196F3;fontColor=#1565C0;fontStyle=1;" edge="1" parent="1" source="users-table" target="cart-table">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    
    <mxCell id="rel3" value="1:N" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#FF9800;fontColor=#F57C00;fontStyle=1;" edge="1" parent="1" source="products-table" target="cart-table">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    
    <!-- MVC Pattern -->
    <mxCell id="mvc-title" value="MVC ARCHITECTURE PATTERN" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#000000;strokeColor=#000000;fontColor=#FFFFFF;fontSize=16;fontStyle=1;align=center;" vertex="1" parent="1">
      <mxGeometry x="50" y="540" width="700" height="40" as="geometry"/>
    </mxCell>
    
    <mxCell id="view" value="VIEW&#xa;(React Components)&#xa;• ProductCard&#xa;• CartItem&#xa;• OrderItem" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#4CAF50;strokeColor=#2E7D32;fontColor=#FFFFFF;fontSize=12;align=center;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="100" y="600" width="150" height="80" as="geometry"/>
    </mxCell>
    
    <mxCell id="controller" value="CONTROLLER&#xa;(Express Routes)&#xa;• productRoutes&#xa;• cartRoutes&#xa;• orderRoutes" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#2196F3;strokeColor=#1565C0;fontColor=#FFFFFF;fontSize=12;align=center;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="320" y="600" width="150" height="80" as="geometry"/>
    </mxCell>
    
    <mxCell id="model" value="MODEL&#xa;(MongoDB Schemas)&#xa;• Product&#xa;• Cart&#xa;• Order" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF9800;strokeColor=#F57C00;fontColor=#FFFFFF;fontSize=12;align=center;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="540" y="600" width="150" height="80" as="geometry"/>
    </mxCell>
    
    <!-- MVC Arrows -->
    <mxCell id="mvc1" value="HTTP Requests" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=3;strokeColor=#4CAF50;fontColor=#2E7D32;fontStyle=1;" edge="1" parent="1" source="view" target="controller">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    
    <mxCell id="mvc2" value="Database Queries" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=3;strokeColor=#2196F3;fontColor=#1565C0;fontStyle=1;" edge="1" parent="1" source="controller" target="model">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    
    </root>
  </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 🎯 HOW TO USE:

### Step 1: Open Draw.io
- Go to https://app.diagrams.net/
- Choose "Create New Diagram"

### Step 2: Import HLD XML
- Copy the HLD XML code above
- In draw.io: File → Import from → Device
- Select "Text" and paste the HLD XML
- Click "Import"

### Step 3: Import LLD XML
- Create new diagram
- Copy the LLD XML code above
- Import same way as HLD

### Step 4: Customize
- Edit colors, text, positions as needed
- Export as PNG/JPG/PDF for presentations

## 📊 RESULT:
You'll get professional system design diagrams showing:
- ✅ HLD: 3-Tier Architecture, Components, User Flow
- ✅ LLD: Code Structure, Database Schema, MVC Pattern
- ✅ Colorful, Professional Layout
- ✅ Ready for Academic Presentation