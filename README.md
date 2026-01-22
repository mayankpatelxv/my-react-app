# bizBuddy - Smart Business Support System

🚀 **Live Website**: [https://mayankpatelxv.github.io/my-react-app](https://mayankpatelxv.github.io/my-react-app)

A comprehensive business management application built with React for managing sales, purchases, inventory, parties, and generating business reports with AI-powered insights.

## ✨ Features

- 📊 **Dashboard** - Real-time business overview with key metrics
- 👥 **Party Management** - Manage customers and suppliers
- 📦 **Item Management** - Track inventory and products
- 🛒 **Sales** - Record and manage sales transactions
- 💰 **Purchases** - Track purchase orders and expenses
- 📈 **Annual Reports** - Comprehensive business analytics
- 🤖 **AI Chatbot** - Get business insights powered by Gemini AI
- 🌍 **Multi-language Support** - English, Spanish, French, German, Hindi
- 💱 **Multi-currency** - USD, EUR, GBP, INR, JPY
- 🎨 **Theme Support** - Light, Dark, and Auto modes
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Frontend**: React, React Router
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **AI**: Google Gemini API
- **Styling**: Pure CSS (no frameworks)
- **Deployment**: GitHub Pages

## 🚀 Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 📱 Available Scripts

### Development

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### `npm run deploy`

Deploys the app to GitHub Pages.\
Make sure you have built the app first with `npm run build`.

## 🌐 Live Deployment

The application is deployed and accessible at:
**[https://mayankpatelxv.github.io/my-react-app](https://mayankpatelxv.github.io/my-react-app)**

### Deployment Process

1. Build the production version: `npm run build`
2. Deploy to GitHub Pages: `npm run deploy`
3. The site will be live at the URL above

## 📖 Documentation

- [Mobile Fix Summary](./MOBILE_FIX_SUMMARY.md) - Mobile responsiveness fixes
- [Android Testing Guide](./ANDROID_TESTING_GUIDE.md) - How to test on Android
- [Routing Fix](./ROUTING_FIX.md) - React Router configuration
- [Sales Setup](./SALES_SETUP.md) - Sales feature documentation
- [Purchases Setup](./PURCHASES_SETUP.md) - Purchases feature documentation

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

### Supabase Setup

1. Create a Supabase project
2. Run the SQL migrations in the `supabase/migrations` folder
3. Configure authentication settings
4. Set up storage buckets for file uploads

## 📱 Mobile Support

The application is fully responsive and optimized for:
- 📱 Mobile devices (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktop (> 1024px)

Special optimizations for Android devices including:
- Touch-friendly buttons (48px minimum)
- Hardware acceleration
- Smooth animations
- Proper viewport handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Mayank Patel
- GitHub: [@mayankpatelxv](https://github.com/mayankpatelxv)
- Website: [https://mayankpatelxv.github.io/my-react-app](https://mayankpatelxv.github.io/my-react-app)

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
