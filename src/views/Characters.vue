<template>
    <div>
      <form @submit.prevent="applyFilters" class="filter-form">
        <input v-model="filters.name" type="text" placeholder="Name" />
        <select v-model="filters.status">
          <option value="">All Statuses</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
        <button type="submit">Apply</button>
      </form>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else class="character-block">
        <div v-if="characters.length > 0" class="character-grid">
          <div v-for="character in characters" :key="character.id">
            <CharacterCard :character="character" />
          </div>
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
          </div>
        </div>
        <div v-else class="no-found">
          No characters found.
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { transliterate } from 'transliteration';
  import CharacterCard from '../components/CharacterCard.vue';
  
  export default {
    components: {
      CharacterCard
    },
    setup() {
      const characters = ref([]);
      const loading = ref(true);
      const currentPage = ref(1);
      const totalPages = ref(1);
      const filters = ref({
        name: '',
        status: ''
      });
  
      const fetchCharacters = async (page = 1) => {
        loading.value = true;
  
        const fetchWithFilters = async (nameFilter) => {
          let url = `https://rickandmortyapi.com/api/character?page=${page}`;
          if (nameFilter) {
            url += `&name=${nameFilter}`;
          }
          if (filters.value.status) {
            url += `&status=${filters.value.status}`;
          }
  
          try {
            const response = await fetch(url);
            const data = await response.json();
  
            if (data.error) {
              return null;
            } else {
              return data;
            }
          } catch (error) {
            console.error('Error fetching characters:', error);
            return null;
          }
        };
  
        let data = await fetchWithFilters(filters.value.name);
        if (!data) {
          const transliteratedName = transliterate(filters.value.name);
          if (transliteratedName !== filters.value.name) {
            data = await fetchWithFilters(transliteratedName);
          }
        }
  
        if (data) {
          characters.value = data.results;
          totalPages.value = data.info.pages;
          currentPage.value = page;
        } else {
          characters.value = [];
          totalPages.value = 1;
          currentPage.value = 1;
        }
  
        loading.value = false;
      };
  
      const applyFilters = () => {
        fetchCharacters();
      };
  
      const prevPage = () => {
        if (currentPage.value > 1) {
          fetchCharacters(currentPage.value - 1);
        }
      };
  
      const nextPage = () => {
        if (currentPage.value < totalPages.value) {
          fetchCharacters(currentPage.value + 1);
        }
      };
  
      onMounted(() => {
        fetchCharacters();
      });
  
      return {
        characters,
        loading,
        currentPage,
        totalPages,
        filters,
        fetchCharacters,
        applyFilters,
        prevPage,
        nextPage
      };
    }
  };
  </script>
  
  <style scoped>
  .filter-form {
    margin: 10px auto;
    display: flex;
    justify-content: center;
  }
  
  .filter-form input[type="text"], 
  .filter-form select {
    padding: 10px;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  button {
    background-color: #42b983;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  form {
    display: flex;
    justify-content: center;
  }

  .character-block {
    display: flex;
    flex-direction: column;
  }
  
  .character-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: center;
    width: 100%;
  }

  .no-found, .loading{
    text-align: center;
    font-weight: 400;
    font-size: 18px;
  }

  @media screen and (max-width: 500px) {
    .filter-form{
        max-width: 350px;
    }

    .filter-form input[type="text"] {
        width: 100px;
    }
  }
  </style>
  