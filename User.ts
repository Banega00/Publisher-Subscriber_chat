import { RedisClientType } from '@redis/client';
import { createClient } from 'redis'
import { CHANNELS } from './config';

export class User{
    
    private name: string;
    private publisher:RedisClientType;
    private subscriber:RedisClientType;
    constructor(name: string) {
        this.name = name;
        this.publisher = createClient();
        this.subscriber = createClient();
    }

    handleMessage = (messageObject: string) =>{
        const {message, user:{ name }}= JSON.parse(messageObject);
        console.log(`${name}: ${message}`);
    }

    setupStreams = async() =>{
        await this.publisher.connect();
        await this.subscriber.connect();

        Object.values(CHANNELS).forEach(channel =>{
            this.subscriber.subscribe(channel, this.handleMessage)
            console.log(`Succcessfully subscribed to channel - ${channel}`);
            console.log('________________________________________________');
        })
    }

    broadcastMessage = async (text: string) => {
        //unsubscribe - publish - subscribe (so you don't get your own message)
        
        await this.subscriber.unsubscribe(CHANNELS.MAIN)
        
        await this.publisher.publish(CHANNELS.MAIN, JSON.stringify({message: text, user: {name: this.name}}))
        
        await this.subscriber.subscribe(CHANNELS.MAIN, this.handleMessage);
    }
}