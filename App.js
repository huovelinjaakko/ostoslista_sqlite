import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('itemsdb.db');

export default function App() {

  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists items (id integer primary key not null, productName text, amount text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into items (productName, amount) values (?, ?);',
        [productName, amount]);
    }, null, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from items;', [], (_, { rows }) => 
        setShoppingList(rows._array)
      );
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from items where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return(
    <View style={styles.container}>
      <TextInput
        style={{ borderWidth: 1, fontSize: 15, width: 150, margin: 5 }}
        placeholder='Product'
        onChangeText={(productName) => setProductName(productName)}
        value={productName}
      />
      <TextInput
        style={{ borderWidth: 1, fontSize: 15, width: 150, marginBottom: 5 }}
        placeholder='Amount'
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <Button title='Save' onPress={saveItem} />
      <Text style={{margin: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        style={{ marginLeft: '5%' }}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => 
          <View style={styles.listcontainer}>
            <Text style={{ fontSize: 18 }}>{item.productName}, {item.amount}</Text>
            <Text style={{ fontSize: 20, color: '#0000ff' }} onPress={() => deleteItem(item.id)}> bought</Text>
          </View>}
        data={shoppingList}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 100,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});