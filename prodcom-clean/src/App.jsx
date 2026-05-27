import React, { useState } from "react";

const PRODUCTS = [
  {
    id: "p1",
    brand: "W Brand",
    name: "A-Line Jewel Green Kurta",
    price: 1499,
    discount: "40% OFF",
    emoji: "👗",
    category: "Kurtas",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "p2",
    brand: "BIBA",
    name: "Pink Floral Ethnic Maxi Dress",
    price: 1899,
    discount: "37% OFF",
    emoji: "💃",
    category: "Dresses",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "p3",
    brand: "Nike",
    name: "Air Force Sneakers",
    price: 7495,
    discount: "25% OFF",
    emoji: "👟",
    category: "Shoes",
    sizes: ["6", "7", "8", "9", "10"]
  }
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [bodyType, setBodyType] = useState("Pear");
  const [fitPreference, setFitPreference] = useState("Regular");

  const [measurements, setMeasurements] = useState({
    chest: 88,
    waist: 74,
    hips: 102,
    height: 162
  });

  const [showMeasurements, setShowMeasurements] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi Priya 👋 I'm Dressup, your AI style advisor."
    }
  ]);

  const [chatInput, setChatInput] = useState("");

  function sendChat() {
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: chatInput
      },
      {
        role: "assistant",
        content:
          "✨ That outfit would look amazing on you. Try pairing it with minimal accessories."
      }
    ]);

    setChatInput("");
  }

  const screens = {
    home: (
      <HomeScreen
        bodyType={bodyType}
        setBodyType={setBodyType}
        fitPreference={fitPreference}
        setFitPreference={setFitPreference}
        measurements={measurements}
        setMeasurements={setMeasurements}
        showMeasurements={showMeasurements}
        setShowMeasurements={setShowMeasurements}
        setScreen={setScreen}
        setSelectedProduct={setSelectedProduct}
      />
    ),

    catalog: (
      <CatalogScreen
        setSelectedProduct={setSelectedProduct}
        setScreen={setScreen}
      />
    ),

    tryon: (
      <TryOnScreen
        product={selectedProduct}
        measurements={measurements}
        fitPreference={fitPreference}
      />
    ),

    chat: (
      <ChatScreen
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        sendChat={sendChat}
      />
    )
  };

  return (
    <div
      style={{
        maxWidth: 390,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "Arial"
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#ff2e7e,#ff6b35)",
          padding: 16,
          color: "#fff"
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800
          }}
        >
          MYNTRA
        </div>

        <div
          style={{
            fontSize: 12
          }}
        >
          Dressup ✨ GenAI Edition
        </div>
      </div>

      {/* Screen */}
      <div
        style={{
          paddingBottom: 90
        }}
      >
        {screens[screen]}
      </div>

      {/* Bottom Nav */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          maxWidth: 390,
          display: "flex",
          background: "#fff",
          borderTop: "1px solid #eee"
        }}
      >
        {[
          ["home", "🏠"],
          ["catalog", "🛍️"],
          ["chat", "💬"]
        ].map(([id, icon]) => (
          <button
            key={id}
            onClick={() => setScreen(id)}
            style={{
              flex: 1,
              padding: 14,
              border: "none",
              background: "none",
              fontSize: 22,
              cursor: "pointer"
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

function HomeScreen({
  bodyType,
  setBodyType,
  fitPreference,
  setFitPreference,
  measurements,
  setMeasurements,
  showMeasurements,
  setShowMeasurements,
  setScreen,
  setSelectedProduct
}) {
  return (
    <div style={{ padding: 16 }}>
      <h2>Hey Priya 👋</h2>

      <p
        style={{
          color: "#666",
          fontSize: 13
        }}
      >
        Your AI stylist is ready.
      </p>

      {/* Body Type */}
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            marginBottom: 8,
            fontWeight: 700
          }}
        >
          Body Type
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap"
          }}
        >
          {[
            "Pear",
            "Hourglass",
            "Apple",
            "Rectangle"
          ].map((b) => (
            <button
              key={b}
              onClick={() => setBodyType(b)}
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                border:
                  bodyType === b
                    ? "2px solid #ff2e7e"
                    : "1px solid #ddd",
                background:
                  bodyType === b
                    ? "#fff0f5"
                    : "#fff",
                cursor: "pointer"
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Fit Preference */}
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            marginBottom: 8,
            fontWeight: 700
          }}
        >
          Fit Preference
        </div>

        <div
          style={{
            display: "flex",
            gap: 8
          }}
        >
          {[
            "Tight",
            "Regular",
            "Loose"
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFitPreference(f)}
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                border:
                  fitPreference === f
                    ? "2px solid #ff6b35"
                    : "1px solid #ddd",
                background:
                  fitPreference === f
                    ? "#fff5f0"
                    : "#fff",
                cursor: "pointer"
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Measurements */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() =>
            setShowMeasurements(!showMeasurements)
          }
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #eee",
            background: "#fafafa",
            cursor: "pointer"
          }}
        >
          📏 Edit Measurements
        </button>

        {showMeasurements && (
          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 12,
              background: "#fff8fb",
              border: "1px solid #ffd6ea"
            }}
          >
            {[
              ["chest", "Chest"],
              ["waist", "Waist"],
              ["hips", "Hips"],
              ["height", "Height"]
            ].map(([k, label]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: 12
                }}
              >
                <span>{label}</span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10
                  }}
                >
                  <button
                    onClick={() =>
                      setMeasurements((m) => ({
                        ...m,
                        [k]: Math.max(
                          50,
                          m[k] - 1
                        )
                      }))
                    }
                  >
                    -
                  </button>

                  <span>
                    {measurements[k]}
                  </span>

                  <button
                    onClick={() =>
                      setMeasurements((m) => ({
                        ...m,
                        [k]: Math.min(
                          250,
                          m[k] + 1
                        )
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div style={{ marginTop: 24 }}>
        <div
          style={{
            fontWeight: 700,
            marginBottom: 12
          }}
        >
          ✨ AI Features
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 12
          }}
        >
          <FeatureCard
            title="AI Try-On"
            icon="🪞"
            onClick={() => setScreen("catalog")}
          />

          <FeatureCard
            title="Smart Sizing"
            icon="📐"
          />

          <FeatureCard
            title="Style Chat"
            icon="💬"
            onClick={() => setScreen("chat")}
          />

          <FeatureCard
            title="Outfit Builder"
            icon="✨"
          />
        </div>
      </div>

      {/* Products */}
      <div style={{ marginTop: 24 }}>
        <div
          style={{
            fontWeight: 700,
            marginBottom: 12
          }}
        >
          Trending
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto"
          }}
        >
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProduct(p);
                setScreen("tryon");
              }}
              style={{
                minWidth: 130,
                border: "1px solid #eee",
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer"
              }}
            >
              <div
                style={{
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 50,
                  background:
                    "linear-gradient(135deg,#ffeef6,#fff0e8)"
                }}
              >
                {p.emoji}
              </div>

              <div style={{ padding: 10 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#666"
                  }}
                >
                  {p.brand}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  {p.name}
                </div>

                <div
                  style={{
                    marginTop: 6,
                    color: "#ff2e7e",
                    fontWeight: 700
                  }}
                >
                  ₹{p.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  icon,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 16,
        borderRadius: 14,
        border: "1px solid #eee",
        cursor: "pointer",
        background: "#fafafa"
      }}
    >
      <div
        style={{
          fontSize: 28,
          marginBottom: 8
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: 13
        }}
      >
        {title}
      </div>
    </div>
  );
}

function CatalogScreen({
  setSelectedProduct,
  setScreen
}) {
  return (
    <div style={{ padding: 16 }}>
      <h2>🛍️ Shop Collection</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 12,
          marginTop: 16
        }}
      >
        {PRODUCTS.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedProduct(p);
              setScreen("tryon");
            }}
            style={{
              border: "1px solid #eee",
              borderRadius: 14,
              overflow: "hidden",
              cursor: "pointer"
            }}
          >
            <div
              style={{
                height: 130,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 54,
                background:
                  "linear-gradient(135deg,#ffeef6,#fff0e8)"
              }}
            >
              {p.emoji}
            </div>

            <div style={{ padding: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "#666"
                }}
              >
                {p.brand}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                {p.name}
              </div>

              <div
                style={{
                  marginTop: 6,
                  color: "#ff2e7e",
                  fontWeight: 700
                }}
              >
                ₹{p.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TryOnScreen({
  product,
  measurements,
  fitPreference
}) {
  if (!product) {
    return (
      <div style={{ padding: 40 }}>
        Select a product first.
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          height: 220,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 90,
          background:
            "linear-gradient(135deg,#ffeef6,#fff0e8)"
        }}
      >
        {product.emoji}
      </div>

      <h2>{product.name}</h2>

      <div
        style={{
          color: "#666",
          marginBottom: 12
        }}
      >
        {product.brand}
      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#ff2e7e"
        }}
      >
        ₹{product.price}
      </div>

      {/* Smart Size */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 14,
          background:
            "linear-gradient(135deg,#fff5e6,#fff0f8)"
        }}
      >
        <div
          style={{
            fontWeight: 700,
            marginBottom: 8
          }}
        >
          📐 Smart Size Recommendation
        </div>

        <div>
          Recommended Size:
          <span
            style={{
              color: "#ff6b35",
              fontWeight: 800,
              marginLeft: 6
            }}
          >
            M
          </span>
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            color: "#666"
          }}
        >
          Based on chest {measurements.chest}cm,
          waist {measurements.waist}cm and{" "}
          {fitPreference} fit preference.
        </div>
      </div>

      {/* AI Preview */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 14,
          background:
            "linear-gradient(135deg,#1a1a2e,#16213e)",
          color: "#fff"
        }}
      >
        <div
          style={{
            fontWeight: 700,
            marginBottom: 10
          }}
        >
          ✨ AI Outfit Visualization
        </div>

        <div
          style={{
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.9)"
          }}
        >
          Picture this: the outfit drapes
          elegantly across your silhouette,
          creating a polished and stylish look
          perfect for modern Indian fashion.
        </div>
      </div>

      <button
        style={{
          marginTop: 20,
          width: "100%",
          padding: 16,
          borderRadius: 14,
          border: "none",
          background:
            "linear-gradient(135deg,#ff2e7e,#ff6b35)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer"
        }}
      >
        🛍️ Add to Bag
      </button>
    </div>
  );
}

function ChatScreen({
  chatMessages,
  chatInput,
  setChatInput,
  sendChat
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 140px)"
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid #eee"
        }}
      >
        <h3>💬 Dressup AI Stylist</h3>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}
      >
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf:
                msg.role === "user"
                  ? "flex-end"
                  : "flex-start",
              background:
                msg.role === "user"
                  ? "#ff2e7e"
                  : "#f5f5f5",
              color:
                msg.role === "user"
                  ? "#fff"
                  : "#111",
              padding: "10px 14px",
              borderRadius: 16,
              maxWidth: "80%",
              lineHeight: 1.5
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 16,
          borderTop: "1px solid #eee"
        }}
      >
        <input
          value={chatInput}
          onChange={(e) =>
            setChatInput(e.target.value)
          }
          placeholder="Ask Dressup anything..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 24,
            border: "1px solid #ddd"
          }}
        />

        <button
          onClick={sendChat}
          style={{
            width: 50,
            borderRadius: "50%",
            border: "none",
            background:
              "linear-gradient(135deg,#ff2e7e,#ff6b35)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}