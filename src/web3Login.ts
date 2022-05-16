import {appEnv} from "./app-env";
import { decodeJWT } from 'did-jwt'
import {ecsign, hashPersonalMessage,toRpcSig} from "ethereumjs-util";

const fetch = require("node-fetch");

async function login(address: string, privateKeyHex: string, organization?: string) {

    address = address.toLowerCase();

    const statement = '';
    const challengeResult = await (await fetch(appEnv.SERVER_URL + '/challenge/' + address)).json();

    const proof = signMessage(challengeResult.challenge, Buffer.from(privateKeyHex, 'hex'));

    //console.log('login', proof, address)

    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

    const {tokenId} = await (await fetch(appEnv.SERVER_URL + '/login', { method: 'POST', headers, body: JSON.stringify({statement, proof, organization, uid: address})})).json();

    return tokenId;
}

function signMessage(msg: string, privateKey: Buffer) {
    const msgHash = hashPersonalMessage(Buffer.from(msg));
    const { v, r, s } = ecsign(msgHash, privateKey);
    const sig = toRpcSig(v, r, s);

    return sig;
}

//Login Member
async function loginMember() {
    const API_TOKEN = await login(appEnv.MEMBER_ADDRESS, appEnv.MEMBER_PRIVATE_KEY);

    const { payload } = decodeJWT(API_TOKEN);

    console.log('loginMember has no claims', payload.claims === undefined)

    //console.log(API_TOKEN);
}

//Login Project Owner
async function loginProjectOwner() {
    const API_TOKEN = await login(appEnv.PROJECT_OWNER_ADDRESS, appEnv.PROJECT_OWNER_PRIVATE_KEY, '0000');

    const { payload } = decodeJWT(API_TOKEN);

    console.log('loginProjectOwner has claims')
    console.log(payload.claims, payload.claims.organization === '0000')

    //console.log(API_TOKEN);
}

(async function () {
    await loginMember();

    console.log('');

    await loginProjectOwner();

    console.log('');
}());