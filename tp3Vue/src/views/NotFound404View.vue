<template>
    <div class="not-found">
      <h1>404</h1>
      <p>Page non trouvée</p>
      <router-link to="/">Retour à la page d'accueil</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundView'
  }
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  
  .not-found h1 {
    font-size: 3em;
  }
  
  .not-found p {
    font-size: 1.5em;
  }
  </style>