import FormulaBuilder from "src/formulacion/Index";

const Formulacion = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* <h1 className="text-2xl font-bold">Formulación</h1> */}
      <div className="mt-4">
        <FormulaBuilder
          services={{
            formulaService: {},
            variableService: {}
          }}
        />
      </div>
    </div>
  );
}

export default Formulacion;