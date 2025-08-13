import FormulaBuilder from "src/formulacion/formulas/Index";

const Formulas = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-1">
        <FormulaBuilder
          formulaService={null}
          variableService={null}
          plantillaService={null}
        />
      </div>
    </div>
  );
}

export default Formulas;