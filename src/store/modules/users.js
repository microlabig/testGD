const users = {
    
    namespaced: true,

    state: {
        users: []
    },

    mutations: {
        SET_USERS: (state, data) => {
            state.users = data;
        },

        EDIT_USER: (state, userEdited) => {
            state.users = state.users.map(user => user.id === userEdited.id ? userEdited : user);
        },

        ADD_USER: (state, newUser) => {
            state.users.push(newUser);
        }
    },

    actions: {
        // чтение списка контактов из JSON
        fetchUsers({commit}) {      
            let data = [];
            try {
                data = require("../../data/users.json");
                commit('SET_USERS', data);                 
                return data;
            } catch (error) {
                throw new Error('Ошибка загрузки контактов');
            } 
        },

        // сохранение контакта в стор
        saveCurrentEditedUser({commit}, userEdited) { 
            commit('EDIT_USER', userEdited);
        },

        // добавление нового пользователя
        addNewUser({commit}, newUser) {
            commit('ADD_USER', newUser);
        }

    },

    getters: {        
        // получить список всех контактов
        getUsers: state => {
            return state.users;
        }
    }

}

export default users;