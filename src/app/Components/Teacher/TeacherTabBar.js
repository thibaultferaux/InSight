import { View, Text } from 'react-native'
import React from 'react'
import { MaterialTabBar } from 'react-native-collapsible-tab-view';

const TeacherTabBar = (props) => {
    return (
        <MaterialTabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#8b5cf6', height: 3, borderRadius: 10 }}
            tabStyle={{ height: 50, margin: 0, width: '50%' }}
            activeColor='#374151'
            inactiveColor='#6b7280'
            style={{ paddingHorizontal: 28, marginTop: 16, backgroundColor: 'transparent' }}
            labelStyle={{ fontFamily: 'Poppins_500Medium', fontSize: 16, textTransform: 'capitalize' }}
            contentContainerStyle={{ flex: 1, justifyContent: 'space-between', width: '50%' }}
            scrollEnabled
        />
    )
}

export default TeacherTabBar