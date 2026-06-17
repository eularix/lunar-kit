import type { NextConfig } from "next";
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "nativewind",
    "react-native-css-interop",
    "react-native",
    "react-native-web",
    "react-native-reanimated",
    "react-native-svg",
    "react-native-gesture-handler",
    "react-native-safe-area-context",
    "@lunar-primitive/adaptive-modal",
    "@lunar-primitive/bottom-sheet",
    "lucide-react-native",
  ],
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web",
      // Worklets has no web build (imports TurboModuleRegistry, absent on RN-Web).
      // Route to the no-op stub so reanimated's web path resolves.
      "react-native-worklets": "@stub/react-native-worklets",
      "react-native/Libraries/Renderer/shims/ReactFabric": "react-native-web",
      "react-native/Libraries/Utilities/codegenNativeComponent": "react-native-web",
      "react-native/Libraries/EventEmitter/EventEmitter": "react-native-web",
      "react-native/Libraries/NativeModules": "react-native-web",
    },
    resolveExtensions: [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
    ],
  },
  webpack: (config, { webpack }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
      "react-native-worklets$": "@stub/react-native-worklets",
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...(config.resolve.extensions || []),
    ];

    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      })
    );

    return config;
  },
};

export default withMDX(nextConfig);
