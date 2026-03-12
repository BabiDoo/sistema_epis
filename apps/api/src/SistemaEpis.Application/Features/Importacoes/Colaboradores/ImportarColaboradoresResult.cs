namespace SistemaEpis.Application.Features.Importacoes.Colaboradores;

public class ImportarColaboradoresResult
{
    public int TotalLinhas { get; init; }
    public int Sucesso { get; private set; }
    public int Falhas => Erros.Count;
    public List<ImportacaoColaboradorErro> Erros { get; } = new();

    public void AdicionarSucesso()
    {
        Sucesso++;
    }

    public void AdicionarErro(int linha, string mensagem)
    {
        Erros.Add(new ImportacaoColaboradorErro(linha, mensagem));
    }
}
