const users = {
    namespaced: true,
    state: {
        users: []
    },

    mutations: {
        SET_USERS: (state, data) => {
            state.users.push(data);
        },
        EDIT_USER: (state, userEdited) => {
            state.users = state.users.map(user => user.id === userEdited.id ? userEdited : user);
        }
    },

    actions: {
        // чтение списка контактов из JSON
        fetchUsers({commit}) {      
            let data = [];
            try {
                data = require("../../data/users.json");
                data.sort( (a,b) => { // сортируем список в алфавитном порядке (по имени и по возрастанию)
                    let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
                    if (nameA < nameB) // сортируем по возрастанию
                        return -1;
                    if (nameA > nameB) 
                        return 1;  
                    return 0; // никакой сортировки
                });
                /*
                data.sort( (a,b) => { // теперь сортируем по фамилии
                    let lastNameA = a.lastName.toLowerCase(), lastNameB = b.lastName.toLowerCase();
                    if (lastNameA < lastNameB) 
                        return -1;
                    if (lastNameA > lastNameB) 
                        return 1;  
                    return 0; 
                }); */
                commit('SET_USERS', data); 
                return data;
            } catch (error) {
                throw new Error('Ошибка загрузки контактов');
            } 
        },
        // сохранение контакта в стор
        saveCurrentEditedUser({commit}, userEdited) { 
            commit('EDIT_USER', userEdited);
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