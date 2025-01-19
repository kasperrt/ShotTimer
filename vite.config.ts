import generouted from '@generouted/solid-router/plugin';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid(), generouted()],
  resolve: { alias: { '@': '/src' } },
});
