<template>
  <div class="home">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Меню контактов</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <form class="form-inline my-2 my-lg-0" @submit.prevent="addingContact">
          <div class="row">
            <div class="col">
              <input v-model="contactUser.name" type="text" class="form-control" placeholder="Имя" />
            </div>
            <div class="col">
              <input
                v-model="contactUser.phoneNumber"
                type="text"
                class="form-control"
                placeholder="Телефонный номер"
              />
            </div>
            <div class="col">
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Добавить контакт</button>
            </div>
          </div>
        </form>
      </div>
      <div>
        <form @submit.prevent="search" class="form-inline my-2 my-lg-0">
          <div class="col">
            <input
              v-model="searchValue"
              class="form-control mr-sm-2"
              type="search"
              placeholder="Поиск"
              aria-label="Поиск"
            />
          </div>
          <div class="col">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Поиск контактов</button>
          </div>
        </form>
      </div>
      <div class="ml-2">
        <button @click="logOut" type="button" class="btn btn-primary">Выход</button>
      </div>
    </nav>
    <button
      v-if="isSearching"
      @click="getAllContacts"
      type="button"
      class="btn btn-primary btn-lg btn-block"
    >Загрузить все контакты</button>
    <div class="d-flex flex-row flex-wrap bd-highlight mb-3 pt-4">
      <div
        v-for="(contact, index) in getContacts"
        :key="index"
        class="card mr-2 mb-3 p-2"
        style="width: 14rem;"
      >
        <img :src="contact.image" class="card-img-top" :alt="contact.name" />
        <div class="card-body p-0">
          <div>
            <h5 v-if="!contact.isEdit" class="card-title">{{ contact.name }}</h5>
            <input v-else type="text" v-model="contact.name" />
          </div>
          <div>
            <p v-if="!contact.isEdit" class="card-text">{{ contact.phoneNumber }}</p>
            <input v-else type="text" v-model="contact.phoneNumber" />
          </div>
          <div class="btn-group w-100" role="group" aria-label="Basic example">
            <div>
              <button
                @click="editingContact(contact)"
                type="button"
                class="btn btn-success btn-sm mr-1"
                :class="{ 'btn-warning': contact.isEdit }"
              >{{ !contact.isEdit ? 'Редактировать' : 'Сохранить'}}</button>
            </div>
            <button
              @click="deleteData(contact.id)"
              type="button"
              class="btn btn-success btn-sm"
              :disabled="contact.isEdit"
            >Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import faker from "faker";
import { mapGetters, mapMutations, mapActions } from "vuex";
faker.locale = "ru";

export default {
  name: "Contacts",
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
