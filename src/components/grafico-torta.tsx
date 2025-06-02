"use client";

import { Users } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslation } from "react-i18next";

// Definir el tipo de genderData
interface GenderData {
  hombres: number;
  mujeres: number;
}

interface GraficotortaProps {
  genderData: GenderData;
}

export default function Graficotorta({ genderData }: GraficotortaProps) {
  const datosEmpleados = [
    { genero: "hombres", cantidad: genderData.hombres, fill: "#1E40AF" }, // Azul
    { genero: "mujeres", cantidad: genderData.mujeres, fill: "#EC4899" }, // Rosa
  ];

  const totalEmpleados = datosEmpleados.reduce((sum, { cantidad }) => sum + cantidad, 0);
  const { t } = useTranslation(); // Hook de traducción dentro del componente funcional
  
  const configuracionGrafico = {
    cantidad: {
      label: "Cantidad",
      type: "number",
    },
    hombres: {
      label: "Hombres",
      color: "#1E40AF", // Azul
      type: "number",
    },
    mujeres: {
      label: "Mujeres",
      color: "#EC4899", // Rosa
      type: "number",
    },
  };

  return (
    <Card className="flex flex-col shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">{t('graficotorta.card.title')}</CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-100">{t('graficotorta.card.description')}{totalEmpleados}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={configuracionGrafico}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart className="transition-all duration-700">
            <ChartTooltip
              content={<ChartTooltipContent nameKey="genero" />}
              cursor={false}
              wrapperStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.85)',  // Fondo blanco con opacidad del 85%
                borderRadius: '8px',                           // Bordes redondeados
                color: 'black',                                // Texto en color negro para mayor contraste
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',   // Sombra suave
              }}
            />
            <Pie className="dark:text-black" data={datosEmpleados} dataKey="cantidad" nameKey="genero" isAnimationActive={true}>
              <LabelList
                dataKey="cantidad"
                position="inside"
                fill="#ffffff"
                stroke="none"
                fontSize={16}
                fontWeight="bold"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 text-sm bg-gray-100 p-4 rounded-b-lg shadow-md dark:bg-gray-800">
        <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-white ">
          <span>{t('graficotorta.card.description')}</span>
          <span className="text-lg font-semibold">{totalEmpleados}</span>
          <Users className="h-5 w-5 text-gray-600 dark:text-white" />
        </div>
        <div className="text-sm text-gray-500 leading-none dark:text-gray-100">
        {t('graficotorta.card.description2')}
        </div>
        <div className="flex justify-between text-sm text-gray-700 space-x-6">
          <div className="flex items-center gap-2 dark:text-gray-100">
            {/* Cuadrado azul para hombres */}
            <div className="w-4 h-4 bg-[#1E40AF] rounded-sm"></div>
            <span className="font-medium ">{t('graficotorta.card.genre')}</span>
            <span>{genderData.hombres}</span>
          </div>
          <div className="flex items-center gap-2 dark:text-gray-100">
            {/* Cuadrado rosa para mujeres */}
            <div className="w-4 h-4 bg-[#EC4899] rounded-sm"></div>
            <span className="font-medium">{t('graficotorta.card.genre2')}</span>
            <span>{genderData.mujeres}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
