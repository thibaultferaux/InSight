import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Tabs } from 'react-native-collapsible-tab-view';

const HEADER_HEIGHT = 100;

const DATA = [0, 1, 2, 3, 4]
const identity = (v) => v + ''

const Header = () => {
  return <View style={styles.header} />
}

const TestTab = () => {
    const renderItem = React.useCallback(({ index }) => {
        return (
            <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
        )
      }, [])

  return (
    <SafeAreaView className="flex-1">
            <Tabs.Container
                renderHeader={Header}
                headerHeight={HEADER_HEIGHT} // optional
            >
                <Tabs.Tab name="A">
                    <Tabs.FlatList
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={identity}
                    />
                </Tabs.Tab>
                <Tabs.Tab name="B">
                    <Tabs.ScrollView>
                        <View className="h-36 bg-slate-400">
                            <Text>Test</Text>
                        </View>
                    </Tabs.ScrollView>
                </Tabs.Tab>
            </Tabs.Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    box: {
      height: 250,
      width: '100%',
    },
    boxA: {
      backgroundColor: 'white',
    },
    boxB: {
      backgroundColor: '#D8D8D8',
    },
    header: {
      height: HEADER_HEIGHT,
      width: '100%',
      backgroundColor: '#2196f3',
    },
  })

export default TestTab