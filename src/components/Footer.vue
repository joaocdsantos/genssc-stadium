<template>
    <footer class="copyright-container">
        <p class="brand_year">
            <span>Gens Sport Clube</span>
            <span> © {{ currentYear }}</span>
        </p>
        <p class="rights">Todos os direitos reservados
        </p>

    </footer>
</template>

<script setup>

const currentYear = new Date().getFullYear()

</script>

<style scoped>
.brand_year {
    margin-bottom: 0;
}

.rights {
    margin-top: 0;
}

.copyright-container {
    text-align: center;
    font-family: 'Roboto', sans-serif;
    font-size: smaller;
    color: grey;
    position: fixed;
    bottom: 0;
    margin-bottom: 10px;
    width: 100%;
    background-color: black;
}
</style>