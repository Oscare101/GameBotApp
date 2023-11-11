import { StyleSheet, Text, View } from 'react-native'

export default function TeamHeader() {
  return (
    <View style={styles.viewCenter}>
      <View style={{ width: '50%', flexDirection: 'row' }}>
        <Text style={styles.miniTitleName}>name</Text>
        <Text style={styles.miniTitle20}>R</Text>
        <Text style={styles.miniTitle15}>K</Text>
        <Text style={styles.miniTitle15}>D</Text>
      </View>
      <View style={styles.separator} />
      <View style={{ width: '50%', flexDirection: 'row' }}>
        <Text style={styles.miniTitle15}>K</Text>
        <Text style={styles.miniTitle15}>D</Text>
        <Text style={styles.miniTitle20}>R</Text>
        <Text style={[styles.miniTitleName, { textAlign: 'right' }]}>name</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewCenter: {
    // width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  miniTitleName: { width: '50%', color: '#999', textAlign: 'left' },
  miniTitle15: { width: '15%', color: '#999', textAlign: 'center' },
  miniTitle20: { width: '20%', color: '#999', textAlign: 'center' },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: '#999',
    marginHorizontal: 5,
  },
})
