import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    /* sera o conteudo do schema, lembrando que não preciso informar todos como em um
  bd relacional */
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    // informo que quero os campos update_at, created_at em todos os registros
    timestamps: true,
  }
);
// mongoose.model('Nome do model', Schema que acabei de criar);
export default mongoose.model('Notification', NotificationSchema);
