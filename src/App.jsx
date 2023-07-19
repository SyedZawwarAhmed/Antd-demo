// src/App.js
import React, { useState } from "react";
import {
  Layout,
  Input,
  Select,
  Card,
  Button,
  Drawer,
  Badge,
  Row,
  Col,
} from "antd";
import "./App.css";
import products from "./productData";

const { Header, Content } = Layout;
const { Option } = Select;

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const addToCart = (product) => {
    const existingCartItem = cartItems.find((item) => item.id === product.id);
    if (existingCartItem) {
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prevCartItems) => [
        ...prevCartItems,
        { ...product, quantity: 1 },
      ]);
    }
  };

  const removeFromCart = (product) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== product.id)
    );
  };

  const handleCartClick = () => {
    setCartVisible(true);
  };

  const handleCartClose = () => {
    setCartVisible(false);
  };

  const handleIncreaseQuantity = (product) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (product) => {
    setCartItems((prevCartItems) =>
      prevCartItems
        .map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <Layout style={{ display: "flex" }}>
      <Header>
        <Row className="header-container">
          <Col span={22}>
            <div className="search-container">
              <Input.Search
                placeholder="Search products..."
                onSearch={handleSearch}
                style={{ width: 250 }}
              />
              <Select
                defaultValue="name"
                onChange={handleSortChange}
                style={{ width: 250 }}
              >
                <Option value="name">Sort by Name</Option>
                <Option value="price">Sort by Price</Option>
              </Select>
            </div>
          </Col>
          <Col span={2}>
            <div className="cart-button-container">
              <Badge count={cartItems.length}>
                <Button type="primary" onClick={handleCartClick}>
                  Cart
                </Button>
              </Badge>
            </div>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "20px" }}>
        <div className="product-list">
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(searchText.toLowerCase())
            )
            .sort((a, b) =>
              sortOption === "price"
                ? a.price - b.price
                : a.name.localeCompare(b.name)
            )
            .map((product) => (
              <Card key={product.id} className="product-card">
                <img width={150} src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
                <Button type="primary" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </Card>
            ))}
        </div>
      </Content>
      <Drawer
        title="Shopping Cart"
        placement="right"
        onClose={handleCartClose}
        visible={cartVisible}
      >
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
                <div className="quantity-buttons">
                  <Button onClick={() => handleIncreaseQuantity(item)}>
                    +
                  </Button>
                  <Button onClick={() => handleDecreaseQuantity(item)}>
                    -
                  </Button>
                </div>
                <Button type="danger" onClick={() => removeFromCart(item)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-total">Total: ${cartTotal}</div>
      </Drawer>
    </Layout>
  );
};

export default App;
