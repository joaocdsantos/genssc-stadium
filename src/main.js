import { createApp } from 'vue'
import App from './App.vue'

// Adiciona o link para FontAwesome dinamicamente
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
document.head.appendChild(link);


// Adiciona o link para uma fonte adicional, por exemplo, Google Fonts
const googleFontsLink = document.createElement('link');
googleFontsLink.rel = 'stylesheet';
googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'; // Exemplo de fonte
document.head.appendChild(googleFontsLink);

createApp(App).mount('#app')
