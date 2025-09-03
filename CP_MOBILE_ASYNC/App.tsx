import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Modal, Alert } from "react-native";
import { Trash, Edit } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const profileAvatarPlaceholders = [
  "https://i.pinimg.com/736x/36/1f/da/361fda0acb56e462fa612acea350fe5d.jpg",
  "https://zonacuriosa.com/wp-content/uploads/2021/03/curiosidades-incriveis-sobre-monstros-sa-2.jpg",
  "https://th.bing.com/th/id/R.4dd4620de56680245fcd67dc1d8f480c?rik=3sGhgCl7TUb6fg&riu=http%3a%2f%2fimg.lum.dolimg.com%2fv1%2fimages%2fgallery_walle__0011_12_72bf2194.jpeg%3fregion%3d0%252C0%252C1580%252C880&ehk=MLSxWnJBkPhW69A3kxUEPOY7T9My3wmGatu%2fyCg7QJ8%3d&risl=&pid=ImgRaw&r=0",
  "https://th.bing.com/th/id/R.dbc2e333f9bad75c0f4d6b86b58170de?rik=k%2byUatVUyL9cYQ&pid=ImgRaw&r=0",
  "https://tse3.mm.bing.net/th/id/OIP.pCVeLbQIfDQKYHVU2re3vwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
];

const USER_STORAGE_KEY = "users";


const UserListScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAvatarToast, setShowAvatarToast] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (data) setUsers(JSON.parse(data));
  };

  const saveUsers = async (newUsers: User[]) => {
    setUsers(newUsers);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUsers));
  };


// Helper to check if a string is a valid image/gif URL (formato)
const isValidImageUrl = (url: string) => {
  console.log("Validating image URL:", url);
  return url.startsWith("http://") || url.startsWith("https://");
};

const handleAddOrEditUser = async () => {
  if (!name || !email) {
    Alert.alert("Preencha todos os campos!");
    return;
  }

  let avatarToUse = avatar;
  let usedPlaceholder = false;
  // Primeiro, verifica formato
  if (!isValidImageUrl(avatarToUse)) {
    avatarToUse = profileAvatarPlaceholders[Math.floor(Math.random() * profileAvatarPlaceholders.length)];
    usedPlaceholder = true;
    console.log("Usando avatar padrão:", avatarToUse);
  }

  if (usedPlaceholder) {
    setShowAvatarToast(true);
    setTimeout(() => setShowAvatarToast(false), 5000);
  }

  if (editingUser) {
    const updatedUsers = users.map(u =>
      u.id === editingUser.id ? { ...u, name, email, avatar: avatarToUse } : u
    );
    saveUsers(updatedUsers);
  } else {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: avatarToUse,
    };
    saveUsers([...users, newUser]);
  }
  setName("");
  setEmail("");
  setAvatar("");
  setEditingUser(null);
  setModalVisible(false);
};

  const handleEdit = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar);
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleDelete = (userId: string) => {
    Alert.alert(
      "Excluir Usuário",
      "Tem certeza que deseja excluir este usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const updatedUsers = users.filter(u => u.id !== userId);
            await saveUsers(updatedUsers);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
        <Edit color="#fdfdfdff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Trash color="#ffffffff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {showAvatarToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Um avatar padrão foi utilizado!</Text>
        </View>
      )}
      <Text style={styles.title}>Usuários</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ color: '#64748b', textAlign: 'center', marginTop: 20 }}>Nenhum usuário cadastrado.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => { setEditingUser(null); setModalVisible(true); }}>
        <Text style={styles.addButtonText}>+ Adicionar Usuário</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingUser ? "Editar Usuário" : "Novo Usuário"}</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="URL do Avatar"
              value={avatar}
              onChangeText={setAvatar}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleAddOrEditUser}>
              <Text style={styles.saveButtonText}>{editingUser ? "Salvar Alterações" : "Adicionar"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalVisible(false); setEditingUser(null); setName(""); setEmail(""); setAvatar(""); }}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: "#ed145b",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.4,
  },
  container: {
    flex: 1,
    backgroundColor: "#111111ff", // fundo preto
    padding: 18,
  },
  title: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 26,
    textAlign: "center",
    backgroundColor: "#ed145b", // destaque rosa
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a", // card cinza-escuro
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#ed145b", // contorno rosa
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 0,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 16,
    backgroundColor: "#e2e8f0",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  userEmail: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 3,
  },
  editButton: {
    backgroundColor: "#ed145b",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginLeft: "auto",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: "#ed145b",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a1a", // modal escuro
    borderRadius: 20,
    padding: 28,
    width: 340,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ed145b", // borda rosa
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ed145b",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#cbd5e1",
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#ffffffff",
    backgroundColor: "#0f172a", // input escuro
  },
  saveButton: {
    backgroundColor: "#ed145b",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#1a1a1a", // botão cancel escuro
    borderWidth: 1.5,
    borderColor: "#ed145b",
    marginTop: 10,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: "#ed145b",
    fontWeight: "700",
    fontSize: 16,
  },
});





export default UserListScreen;

