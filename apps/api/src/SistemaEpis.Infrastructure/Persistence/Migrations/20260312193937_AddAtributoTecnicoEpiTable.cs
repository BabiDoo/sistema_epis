using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEpis.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAtributoTecnicoEpiTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_epi_atributos_tecnicos_EpiId",
                table: "epi_atributos_tecnicos");

            migrationBuilder.DropIndex(
                name: "IX_epi_atributos_tecnicos_Nome",
                table: "epi_atributos_tecnicos");

            migrationBuilder.RenameColumn(
                name: "Nome",
                table: "epi_atributos_tecnicos",
                newName: "Chave");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "epi_atributos_tecnicos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_epi_atributos_tecnicos_EpiId_Chave",
                table: "epi_atributos_tecnicos",
                columns: new[] { "EpiId", "Chave" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_epi_atributos_tecnicos_EpiId_Chave",
                table: "epi_atributos_tecnicos");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "epi_atributos_tecnicos");

            migrationBuilder.RenameColumn(
                name: "Chave",
                table: "epi_atributos_tecnicos",
                newName: "Nome");

            migrationBuilder.CreateIndex(
                name: "IX_epi_atributos_tecnicos_EpiId",
                table: "epi_atributos_tecnicos",
                column: "EpiId");

            migrationBuilder.CreateIndex(
                name: "IX_epi_atributos_tecnicos_Nome",
                table: "epi_atributos_tecnicos",
                column: "Nome");
        }
    }
}
