// rabbitmq.module.ts
import { Global, Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin123@localhost:5672'],
          queue: 'doc_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ])
  ],
  exports: [ClientsModule]
})
export class RabbitMQModule {}
