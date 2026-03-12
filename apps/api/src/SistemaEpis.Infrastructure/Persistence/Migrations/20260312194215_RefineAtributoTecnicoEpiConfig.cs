using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEpis.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RefineAtributoTecnicoEpiConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_epi_atributos_tecnicos_epi_EpiId",
                table: "epi_atributos_tecnicos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_epi_atributos_tecnicos",
                table: "epi_atributos_tecnicos");

            migrationBuilder.DropIndex(
                name: "IX_epi_atributos_tecnicos_EpiId_Chave",
                table: "epi_atributos_tecnicos");

            migrationBuilder.RenameTable(
                name: "epi_atributos_tecnicos",
                newName: "atributo_tecnico_epi");

            migrationBuilder.AddPrimaryKey(
                name: "PK_atributo_tecnico_epi",
                table: "atributo_tecnico_epi",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_atributo_tecnico_epi_EpiId_Chave_Valor",
                table: "atributo_tecnico_epi",
                columns: new[] { "EpiId", "Chave", "Valor" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_atributo_tecnico_epi_epi_EpiId",
                table: "atributo_tecnico_epi",
                column: "EpiId",
                principalTable: "epi",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_atributo_tecnico_epi_epi_EpiId",
                table: "atributo_tecnico_epi");

            migrationBuilder.DropPrimaryKey(
                name: "PK_atributo_tecnico_epi",
                table: "atributo_tecnico_epi");

            migrationBuilder.DropIndex(
                name: "IX_atributo_tecnico_epi_EpiId_Chave_Valor",
                table: "atributo_tecnico_epi");

            migrationBuilder.RenameTable(
                name: "atributo_tecnico_epi",
                newName: "epi_atributos_tecnicos");

            migrationBuilder.AddPrimaryKey(
                name: "PK_epi_atributos_tecnicos",
                table: "epi_atributos_tecnicos",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_epi_atributos_tecnicos_EpiId_Chave",
                table: "epi_atributos_tecnicos",
                columns: new[] { "EpiId", "Chave" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_epi_atributos_tecnicos_epi_EpiId",
                table: "epi_atributos_tecnicos",
                column: "EpiId",
                principalTable: "epi",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
