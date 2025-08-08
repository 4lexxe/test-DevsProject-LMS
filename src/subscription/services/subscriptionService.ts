import api from "@/shared/api/axios";

const SUBS = "/subscriptions";

export const getSubscriptionSuccess = async () => {
  try {
    const response = await api.get(`${SUBS}/success`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching subscription success:", error.response?.data || error.message || error);
    throw error;
  }
};

export const getSubscriptionData = async () => {
  try {
    const response = await api.get(`${SUBS}/user`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching subscription data:", error.response?.data || error.message || error);
    throw error;
  }
};


export const cancelSubscription = async (id : string) => {
  try {
    const response = await api.put(`${SUBS}/${id}/cancel`);
    return response.data;
  } catch (error: any) {
    console.error("Error al cancelar la suscripcion:", error.response?.data || error.message || error);
    throw error;
  }
};

export const downloadInvoice = async (id : string) => {
  try {
    const response = await api.get(`/invoices/${id}/download`, {
      responseType: "arraybuffer", // Cambiado para manejar binarios
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al descargar la factura:", error.response?.data || error.message || error);
    throw error;
  }
};

