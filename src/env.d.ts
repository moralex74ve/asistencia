/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: {
      id: string;
      rol: string;
    };
    csrfToken: string;
  }
}
