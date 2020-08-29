import Api from '@/services/Api';

export default {
  index() {
    return Api().get('chats');
  },
  show(userId) {
    return Api().get(`chats/${userId}`);
  },
  post(message) {
    return Api().post('chats', message);
  },
  getNotes() {
    return Api().get('notes');
  },
};
