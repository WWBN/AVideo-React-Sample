# AVideo-React-Sample 🎬⚛️  

**AVideo-React-Sample** is an open-source project demonstrating how to build a custom **React-based frontend** for AVideo. This serves as a reference implementation for developers looking to create their own layout while integrating with AVideo’s API.

👉 **Live Sample:** [https://react.tutorials.avideo.com/](https://react.tutorials.avideo.com/)

## 🌟 Features
✔ Fully responsive **React-based layout**  
✔ Uses **TailwindCSS** for styling  
✔ Supports **Dark Mode** and **Theme Switching**  
✔ Includes **User Authentication (Login/Logout)**  
✔ API integration with **AVideo’s backend**  
✔ Example **video listing, playback, and user interactions**  
✔ Easily extendable to support additional **AVideo API features**  

---

## 📌 Getting Started

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/WWBN/AVideo-React-Sample.git
cd AVideo-React-Sample
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Configure Your AVideo Instance URL**
To set up your own AVideo instance, create a `.env` file in the project root:

```sh
touch .env
```

Then, open the `.env` file and add the following line, replacing **your AVideo URL**:

```
VITE_BASE_URL=https://your-avideo-instance.com/
```

> This will ensure that the React app connects to your **AVideo backend** dynamically.

---

### 4️⃣ **Run the Development Server**
```sh
npm run dev
```
Your React-based AVideo frontend will now be available at:  
👉 **`http://localhost:3000`**

---

## 🛠 Tech Stack
- **React** ⚛️ - Frontend framework  
- **TailwindCSS** 🎨 - Styling  
- **Vite** ⚡ - Fast development server  
- **Fetch API** 📡 - Handles API requests  
- **LocalStorage** 💾 - Stores authentication info  

---

## 🔌 API Integration
This project interacts with the **AVideo API** to fetch videos, handle user authentication, and manage playback.

### Example API Call (Login)
```js
const response = await fetch(`${import.meta.env.VITE_BASE_URL}/get.json.php?APIName=signIn`, {
    method: "POST",
    body: JSON.stringify({ user: "admin", pass: "1234" }),
    headers: { "Content-Type": "application/json" },
});
const data = await response.json();
```

> **💡 Note:** API calls use `import.meta.env.VITE_BASE_URL`, which is set in the `.env` file.

---

## 📡 Expanding API Support  
Looking to enhance the sample project with **more AVideo API functionalities**? The AVideo API provides various endpoints for:  
✅ **User management** (register, profile, subscriptions)  
✅ **Live streaming** (start/stop live streams, WebRTC integration)  
✅ **Monetization** (Pay-Per-View, ads, memberships)  
✅ **Analytics & Reports** (video views, user engagement)  

Check out the **official AVideo API documentation** for a full list of available endpoints:  
📖 **[AVideo API Wiki](https://github.com/WWBN/AVideo/wiki/AVideo-Platform-API)**

---

## 🔗 Useful Links
- 📌 **AVideo GitHub:** [https://github.com/WWBN/AVideo](https://github.com/WWBN/AVideo)  
- 📖 **Documentation:** [https://github.com/WWBN/AVideo/wiki](https://github.com/WWBN/AVideo/wiki)  

---

## 📜 License
This project is **open-source** and follows the **MIT License**.

---

## 🤝 Contributing
Contributions are welcome! Feel free to submit pull requests or open issues.

👨‍💻 **Developed by:** [Daniel Neto](https://github.com/DanielnetoDotCom)  
```
