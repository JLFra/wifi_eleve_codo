//% groups=['Commun', 'Client', 'Serveur']
//% color="#037268" icon="\uf1eb"
namespace wifi {
    let port = '2000'
    //% block="Connexion au point d'accès SSID $SSID mot de passe $password adresse IP $adresse_IP "
    //% group='Commun'
    //% SSID.defl='SNT1' password.defl='12345678'
    //% adresse_IP.defl='192.168.0.5'
    export function connect_AP_IP(SSID: string, password: string, adresse_IP: string): void {
        basic.showIcon(IconNames.Asleep)
        basic.pause(2000)
        serial.setRxBufferSize(100)
        serial.setTxBufferSize(100)
        serial.redirect(
        SerialPin.P0,
        SerialPin.P12,
        BaudRate.BaudRate115200
        )
        basic.pause(2000)
        basic.showIcon(IconNames.SmallSquare)
        serial.writeString("connect_to_AP,"+SSID+","+password)
        basic.pause(2000)
        let reception = ""
        while (reception == "") {
            serial.writeString("connected_to_AP?")
            reception = serial.readUntil(serial.delimiters(Delimiters.Hash))
            if (reception == "connected_to_AP") { 
                serial.writeString("set_IP_address_esp32,"+adresse_IP)
                basic.pause(1000)
                basic.showString("C")
            }
            else {
                basic.showIcon(IconNames.Square)
                basic.pause(2000)	
            }
        }
    }
    //% block="Envoi $donnee au serveur adresse IP $adresseIP_serveur"
    //% group='Client'
    //% donnee.defl='essai' adresseIP_serveur.defl="192.168.0.101"
    export function envoi_donnee_serveur(donnee: string, adresseIP_serveur: string): void {
        let port = "2000"
        serial.writeString("Connect_server_send,"+adresseIP_serveur+","+port+","+donnee)
    }

    //% block="Donnee reçue du client"
    //% group='Serveur'
    export function donnee_recue(): string {
        serial.writeString("Start_read_client,"+port)
        return serial.readUntil(serial.delimiters(Delimiters.Hash));
    }

    //% block="Adresse IP client connecté"
    //% group='Serveur'
    export function IPaddress_client_connected(): string {
        serial.writeString("IPaddress_client_connected?")
        return serial.readUntil(serial.delimiters(Delimiters.Hash));
    }

    //% block="Donnee reçue du serveur"
    //% group='Client'
    export function answer_server(): string {
        serial.writeString("answer_server")
        return serial.readUntil(serial.delimiters(Delimiters.Hash));
    }

    //% block="Envoi $reponse au client "
    //% group='Serveur'
    //% reponse.defl='reponse'
    export function answer_client_request(reponse: string): void {
        serial.writeString("answer_client_request,"+reponse)
    }
}