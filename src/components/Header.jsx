export default function Header() {
  return (
    <div className="text-center mb-6">
      <h1 className="text-3xl md:text-4xl font-bold text-cyan-300">
        Microscópio Virtual de Hematologia
      </h1>
      <p className="text-gray-300 mt-2">Simulador de lâmina de sangue periférico</p>
      <p className="text-gray-400 text-sm mt-4">
        Arraste para mover a lâmina | Use os botões ou o scroll para zoom
      </p>
    </div>
  );
}
