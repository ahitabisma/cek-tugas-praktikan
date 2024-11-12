import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export interface Response {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface UpdateData {
  id: string;
  nilai: string;
  catatan: string;
}

export const useResponseStore = defineStore("response", () => {
  const baseUrl = "https://script.google.com/macros/s/AKfycbyGyHaYETDKf5QL0STYXnSOArKwv-Wn1vv63P1FbQE1YHPiEx1KndnXuiy0_pd42laGgA/exec";

  const responses = ref<Response[]>([]);
  const response = ref<Response>();
  const errorMessage = ref<string>("");

  // Get Response By NIM
  async function getResponseByNim(nim: string) {
    try {
      const response = await axios.get(`${baseUrl}?action=nim&nim=${nim}`);

      if (response.data.code === 404) {
        errorMessage.value = response.data.data;
      } else if (response.data.code !== 200) {
        errorMessage.value = response.data.data;
      } else {
        errorMessage.value = "";
        responses.value = response.data.data || [];
      }

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = "Maaf ada error";
      }
    }
  }

  // Get Response By Email
  async function getResponseByEmail(email: string) {
    try {
      const response = await axios.get(`${baseUrl}?action=email&email=${email}`);

      if (response.data.code === 404) {
        errorMessage.value = response.data.data;
      } else if (response.data.code !== 200) {
        errorMessage.value = response.data.data;
      } else {
        errorMessage.value = "";
        responses.value = response.data.data || [];
      }

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = "Maaf ada error";
      }
    }
  }

  return { responses, response, getResponseByNim, getResponseByEmail, errorMessage };
});
