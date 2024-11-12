<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { useResponseStore } from '@/stores/response';
import { reactive, ref } from 'vue';

const responseStore = useResponseStore();
const nim = ref<string>('');
const isLoading = ref<boolean>(false);

const loadingStates = reactive<{ [key: string]: boolean }>({});

// Search
function kirim() {
  if (!nim.value) {
    responseStore.errorMessage = 'Masukin NIM dulu';
    return;
  }

  isLoading.value = true;
  responseStore.errorMessage = '';

  responseStore.getResponseByNim(nim.value)
    .finally(() => {
      isLoading.value = false;
    });
}

// Reset input search
function reset() {
  nim.value = '';
  responseStore.responses = [];
  responseStore.errorMessage = '';
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  return date.toLocaleDateString('id-ID', options);
};
</script>


<template>
  <main class="mx-6 md:mx-16 my-14">
    <!-- Input and Search Buttons -->
    <label class="input input-bordered flex items-center gap-2">
      <input type="text" class="grow" placeholder="Masukin NIM" v-model="nim" @keydown.enter="kirim" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
        <path fill-rule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clip-rule="evenodd" />
      </svg>
    </label>

    <!-- Reset and Search Buttons -->
    <div class="mt-5">
      <button @click="reset" class="btn btn-sm mr-5">Reset</button>
      <button @click="kirim" class="btn btn-sm">Cari</button>
    </div>

    <!-- Error Message -->
    <div v-if="responseStore.errorMessage" class="mt-5">
      <p class="text-red-500">{{ responseStore.errorMessage }}</p>
    </div>

    <!-- Identitas -->
    <div v-if="!isLoading && responseStore.responses.length > 0" class="mt-10 md:mt-8 mb-10 md:mb-8">
      <ul class="flex gap-4">
        <li class="w-[25%] md:w-[15%] lg:w-[7%]">Nama</li>
        <li class="w-1/12 text-center">:</li>
        <li class="w-2/3">{{ responseStore.responses[0]['NAMA'] }}</li>
      </ul>
      <ul class="flex gap-4">
        <li class="w-[25%] md:w-[15%] lg:w-[7%]">NIM</li>
        <li class="w-1/12 text-center">:</li>
        <li class="w-2/3">{{ responseStore.responses[0]['NIM'] }}</li>
      </ul>
      <ul class="flex gap-4">
        <li class="w-[25%] md:w-[15%] lg:w-[7%]">SHIFT Baru</li>
        <li class="w-1/12 text-center">:</li>
        <li class="w-2/3">{{ responseStore.responses[0]['SHIFT Baru'] }}</li>
      </ul>
      <ul class="flex gap-4">
        <li class="w-[25%] md:w-[15%] lg:w-[7%]">SHIFT KRS</li>
        <li class="w-1/12 text-center">:</li>
        <li class="w-2/3">{{ responseStore.responses[0]['SHIFT KRS'] }}</li>
      </ul>
    </div>

    <!-- Response Table -->
    <div v-if="!isLoading && !responseStore.errorMessage && responseStore.responses.length > 0" class="overflow-x-auto">
      <table class="table w-full min-w-[400px]">
        <thead>
          <tr>
            <th class="text-center">Tugas Pertemuan Ke</th>
            <th class="text-center">Timestamp</th>
          </tr>
        </thead>
        <!-- Data -->
        <tbody>
          <tr v-for="(item, index) in responseStore.responses" :key="index">
            <td class="text-center">{{ item['Pertemuan ke'] }}</td>
            <td class="text-center">{{ formatDate(item['Timestamp']) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="mt-5">
      <p>Mohon bersabar...</p>
    </div>
  </main>
</template>
