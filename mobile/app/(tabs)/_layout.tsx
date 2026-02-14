import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Video, User } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#050505',
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255,255,255,0.05)',
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: '#52525b',
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="entrevistas"
                options={{
                    title: 'Historial',
                    tabBarIcon: ({ color }) => <Video color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tabs>
    );
}
