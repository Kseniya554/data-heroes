<template>
  <div class="character">
    <img :src="character.image" :alt="character.name" />
    <div class="character-info">
      <h2 class="character-title">{{ character.name }}</h2>
      <p class="character-text">Status: {{ character.status }}</p>
      <p class="character-text">Species: {{ character.species }}</p>
      <p class="character-text">Gender: {{ character.gender }}</p>
      <p class="character-text">Origin: {{ character.origin.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CharacterCard',
  props: {
    character: Object,
  },
};
</script>

<style scoped>
    .character-text {
        margin: 5px;
    }

    @media screen and (max-width: 500px) {
        .character-title {
            font-size: 20px;
        }
    }
</style>
