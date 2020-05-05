<template>
  <v-card>
    <v-app-bar max-width="1100" app class="mx-auto cyan lighten-1" dark>
      <v-toolbar-title>
        Контакты
      </v-toolbar-title>

      <v-spacer />

      <!-- ===== форма поиска контактов ===== -->

      <ValidationObserver v-slot="{ handleSubmit }" slim>
        <v-form @submit.prevent="handleSubmit(search)">
          <v-row class="mt-0">
            <ValidationProvider
                rules="alpha"
                v-slot="{ errors }"
                name="Пароль"
                mode="eager"
                vid="password"
              >
              <v-text-field
                v-model="searchValue"
                :error-messages="errors"
                class="mt-6"
              />
            </ValidationProvider>
            <v-card-actions>
              <v-btn class="caption" type="submit" color="cyan darken-1" dark>поиск</v-btn>
            </v-card-actions>
            <v-card-actions
              v-if="isSearching"
              @click="getAllContacts"
            >
              <v-btn class="caption" type="submit" color="cyan darken-1" dark>показать все контакты</v-btn>
            </v-card-actions>
          </v-row>
        </v-form>
      </ValidationObserver>

      <v-spacer />

      <!-- ===== кнопка выхода из приложения ===== -->
      <v-btn class="caption" @click="logOut" color="cyan darken-2">
        <v-icon dark left>mdi-arrow-left</v-icon>выход
      </v-btn>

    </v-app-bar>

    <v-card
      max-width="1100"
      class="d-flex justify-space-around pa-12 mt-6 mx-auto"
      color="cyan lighten-4"
    >

      <!-- ===== форма добавления контактов ===== -->

      <ValidationObserver v-slot="{ handleSubmit }" slim>
        <v-form @submit.prevent="handleSubmit(addingContact)">
          <v-row class="mt-5">
            <ValidationProvider
              rules="alpha"
              v-slot="{ errors }"
              name="Имя"
              mode="eager"
            >
              <v-text-field
                v-model="contactUser.name"
                :error-messages="errors"
                class="mr-5"
                placeholder="Имя"
              />
            </ValidationProvider>

            <ValidationProvider
                rules="alpha"
                v-slot="{ errors }"
                name="Телефон"
                mode="eager"
              >
              <v-text-field
                v-model="contactUser.phoneNumber"
                :error-messages="errors"                
                placeholder="Телефон"
              />
            </ValidationProvider>
            <v-card-actions>
              <v-btn class="caption" type="submit" color="cyan darken-1" dark>добавить контакт</v-btn>
            </v-card-actions>
          </v-row>
        </v-form>
      </ValidationObserver>


    </v-card>

    <v-card
      max-width="1100"
      class="d-flex flex-wrap mx-auto"
      color="yellow lighten-5"
    >
      <v-card
        max-width="200"
        v-for="(contact, index) in getContacts"
        :key="index"
        class="pa-1 mr-4 mb-4"
      >
        <v-img :src="contact.image" height="200px" class="white--text align-end" :alt="contact.name" />
        <div>
          <v-card-title v-if="!contact.isEdit" class="pa-0">{{ contact.name }}</v-card-title>
          <input v-else type="text" v-model="contact.name" />
        </div>
        <div>
          <v-card-subtitle v-if="!contact.isEdit" class="pa-0">{{ contact.phoneNumber }}</v-card-subtitle>
          <input v-else type="text" v-model="contact.phoneNumber" />
        </div>
        <v-card-actions class="px-0">
          <v-btn
            :class="{ 'cyan lighten-4': !contact.isEdit, 'warning': contact.isEdit }"
            @click="editingContact(contact)"
            class="caption pa-0 px-1"
          >
            {{ !contact.isEdit ? 'Редактировать' : 'Сохранить'}}
          </v-btn>

          <v-btn
            color="cyan lighten-4"
            @click="deleteData(contact.id)"
            :disabled="contact.isEdit"
            class="caption pa-0 px-1 ml-auto"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
    <v-alert
      v-if="getContacts.length < 1"
      type="info"
      max-width="1100"
      class="mx-auto"
    >
      Контакт не найден, попробуйте ввести другое имя</v-alert>
  </v-card>
</template>

<script>
import {
  extend,
  localize,
  ValidationProvider,
  ValidationObserver
} from "vee-validate";
import ru from "vee-validate/dist/locale/ru.json";

import { required, alpha } from "vee-validate/dist/rules";

import faker from "faker";
import { mapGetters, mapMutations, mapActions } from "vuex";
faker.locale = "ru";

export default {
  name: "Contacts",
    components: {
    ValidationProvider,
    ValidationObserver
  },

  data: () => ({
    contactUser: {
      id: faker.random.uuid(),
      name: "",
      phoneNumber: "",
      image: faker.image.avatar(),
      isEdit: false
    },
    searchValue: "",
    isSearching: false
  }),
  computed: {
    ...mapGetters(["getContacts"])
  },
  methods: {
    ...mapActions([
      "deleteData",
      "sendData",
      "changeData",
      "searchContact",
      "requestData"
    ]),
    ...mapMutations(["deleteContact", "deleteToken"]),
    addingContact() {
      const userContact = { ...this.contactUser };
      this.sendData(userContact);
      this.contactUser = {
        id: faker.random.uuid(),
        name: "",
        phoneNumber: "",
        image: faker.image.avatar(),
        isEdit: false
      };
    },
    // редактирование контакта
    // запрос происходит только когда режим редактирования true
    editingContact(contact) {
      if (!contact.isEdit) {
        contact.isEdit = !contact.isEdit;
        return;
      } else {
        contact.isEdit = !contact.isEdit;
        const newInfo = { ...contact };
        this.changeData(newInfo);
      }
    },
    search() {
      this.searchContact(this.searchValue);
      this.searchValue = "";
      this.isSearching = true;
    },
    getAllContacts() {
      this.requestData();
      this.isSearching = false;
    },
    logOut() {
      this.deleteToken();
      this.$router.push("/login").catch(() => {});
    }
  }
};
</script>
