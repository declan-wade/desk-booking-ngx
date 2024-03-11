"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const getData = async () => {
  try {
    const data = await prisma.bookings.findMany();
    return data;
  } catch (error) {
    console.error(error);
    throw "An error occurred";
  }
};

export async function insertData(payload) {
  const user = await prisma.bookings.create({
    data: {
      name: payload.name,
      date: payload.date,
    },
  });
}

export const deleteData = async (id) => {
  try {
    const data = await prisma.bookings.delete({where: {id: id}});
    return data; 
  } catch (error) {
    console.error(error);
    throw "An error occurred";
  }
};

export const getOne = async (id) => {
  try {
    const integerId = parseInt(id, 10);
    const data = await prisma.bookings.findUnique({where: {id: integerId}});
    return data; 
  } catch (error) {
    console.error(error);
    throw "An error occurred";
  }
};

export const updateOne = async (payload, id) => {
  try {
    const integerId = parseInt(id, 10);
    const data = await prisma.bookings.update({where: {id: integerId}, data: {
      name: payload.name,
      date: payload.date,
    }});
    return data; 
  } catch (error) {
    console.error(error);
    throw "An error occurred";
  }
};