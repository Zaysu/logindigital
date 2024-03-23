import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';

export function TelaSegura({ onLogout }) {
  const handleLogout = () => {
    // logout 
    onLogout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuário logado com sucesso! </Text>
      <TouchableOpacity onPress={handleLogout}><Text style={styles.botton}>Deslogar</Text></TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [biometria, setBiometria] = useState(false);
  const [render, setRender] = useState(false);
  const [access, setAccess] = useState(false);

  useEffect(() => {
    (async () => {
      const compativel = await LocalAuthentication.hasHardwareAsync();
      setBiometria(compativel);
    })();
  }, []);

  const changeRender = () => setRender(true);

  useEffect(() => {
    if (render) {
      (async () => {
        const authentication = await LocalAuthentication.authenticateAsync();
        if (authentication.success) {
          setAccess(true);
        } else {
          setAccess(false);
          setRender(false);
        }
      })();
    }
  }, [render]);

  const handleLogout = () => {
    setRender(false);
    setAccess(false);
  };

  if (render && access) {
    return (
      <TelaSegura onLogout={handleLogout} />
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {biometria
            ? 'Olá!'
            : 'Dispositivo não compatível com biometria'
          }
        </Text>
        <TouchableOpacity onPress={changeRender}><Text style={styles.botton}>Login </Text></TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botton:{
    backgroundColor:'#007AFF',
    color:'#fff',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:5,
    marginBottom:10,
  },
  title:{
    fontSize:20,
    marginBottom:20,
    textAlign:'center',
  },
});