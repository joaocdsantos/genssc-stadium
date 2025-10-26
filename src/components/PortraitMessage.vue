<template>
  <div class="portrait-message">
    <div class="message-content">
      <div class="image-container">
        <img src="../assets/gsc_logo_vector.png" alt="Logotipo do Gens Sport Clube"/>
      </div>

      <!-- Ícone animado de telefone -->
      <div class="rotate-phone"></div>

      <p class="text">Por favor vire o telefone para modo horizontal</p>
    </div>
  </div>
</template>

<style scoped>
.portrait-message {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.message-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  text-align: center;
}

/* Logo */
.image-container img {
  width: 120px;
  max-width: 50vw;
  height: auto;
  filter: drop-shadow(0 0 6px rgba(255,255,255,0.4));
}

/* Telefone animado */
.rotate-phone, img {
  width: 40px;
  height: 70px;
  border-radius: 8px;
  position: relative;
  animation: rotate-phone 3s infinite ease-in-out;
}
.rotate-phone{
  border: 3px solid white;

}
.rotate-phone::after, img::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 3px;
  background: white;
  border-radius: 2px;
}

/* Animação: roda entre portrait e landscape */
@keyframes rotate-phone {
  0%, 20%   { transform: rotate(0deg); }
  40%, 60%  { transform: rotate(90deg); }
  80%, 100% { transform: rotate(0deg); }
}

.text {
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  opacity: 0.85;
}
</style>