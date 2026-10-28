//Punto de entrada de la app: provee las áreas seguras y monta la pantalla principal
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SensorsScreen from './screens/SensorsScreen';

export default function Gps() {
    return (
        //SafeAreaProvider envuelve el contenido y permite que los componentes conozcan las áreas
        //SensorsScreen muestra la pantalla principal de sensores
        //StatusBar configura el estilo de los iconos de la barra superior
        <SafeAreaProvider>
            <SensorsScreen />
            <StatusBar style="dark" />
        </SafeAreaProvider>
    );
}