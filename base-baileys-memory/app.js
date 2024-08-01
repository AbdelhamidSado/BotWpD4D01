const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const {appendToSheet} = require("./utils")


const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer('Hola, cómo estás? 😃 Somos Data4Decision 🚀',{
        delay: 5000, 
    }
    )
    .addAnswer('Nos contás en qué te podemos ayudar', { capture: true }, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ caso: ctx.body });
        }
    )

    .addAnswer('Nos brisdas tu nombre para que te agendamos', { capture: true }, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ nombre: ctx.body });
        }
    )
    .addAnswer('A la brevedad un asesor se comunicara con Ud para brindarle una solución personalizada Saludos' ,)
    .addAnswer('Saludos' ,)

    .addAnswer('Por emergencias llamar al 3815276271', null,
        async (ctx, ctxFn) => {
            console.log(ctxFn.state.get('caso'));
            console.log(ctxFn.state.get('nombre'));
            const caso =  ctxFn.state.get('caso');
            const nombre =  ctxFn.state.get('nombre');
            const telefono = ctx.from;  // Capturamos el número de teléfono
            await appendToSheet([[caso, nombre, telefono] ]);
        }
    )


const flowPrincipal = addKeyword(["hola"])
    .addAnswer('Hola, cómo estás? 😃😃😃😃😃😃😃😃😃Somos Data4Decision 🚀🚀🚀')


    .addAnswer('Nos pasás tu teléfono para contactarnos', { capture: true },
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ telefono: ctx.body });
        }
    )
    .addAnswer('En breve un asesor estará respondiendo tu consulta', null,
        async (ctx, ctxFn) => {
            console.log(ctxFn.state.get('caso'));
            console.log(ctxFn.state.get('nombre'));
            console.log(ctxFn.state.get('telefono'));
        }
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowWelcome])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
