/// <reference types="@lunar-kit/css/types" />
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './Navigation';

export default function Main() {
  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
}
