using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEpis.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameEpiTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_epi_atributos_tecnicos_epis_EpiId",
                table: "epi_atributos_tecnicos");

            migrationBuilder.DropForeignKey(
                name: "FK_epis_categorias_epi_CategoriaEpiId",
                table: "epis");

            migrationBuilder.DropPrimaryKey(
                name: "PK_epis",
                table: "epis");

            migrationBuilder.RenameTable(
                name: "epis",
                newName: "epi");

            migrationBuilder.RenameIndex(
                name: "IX_epis_Nome",
                table: "epi",
                newName: "IX_epi_Nome");

            migrationBuilder.RenameIndex(
                name: "IX_epis_CategoriaEpiId",
                table: "epi",
                newName: "IX_epi_CategoriaEpiId");

            migrationBuilder.RenameIndex(
                name: "IX_epis_Ca_Fabricante",
                table: "epi",
                newName: "IX_epi_Ca_Fabricante");

            migrationBuilder.AddPrimaryKey(
                name: "PK_epi",
                table: "epi",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_epi_categorias_epi_CategoriaEpiId",
                table: "epi",
                column: "CategoriaEpiId",
                principalTable: "categorias_epi",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_epi_atributos_tecnicos_epi_EpiId",
                table: "epi_atributos_tecnicos",
                column: "EpiId",
                principalTable: "epi",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_epi_categorias_epi_CategoriaEpiId",
                table: "epi");

            migrationBuilder.DropForeignKey(
                name: "FK_epi_atributos_tecnicos_epi_EpiId",
                table: "epi_atributos_tecnicos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_epi",
                table: "epi");

            migrationBuilder.RenameTable(
                name: "epi",
                newName: "epis");

            migrationBuilder.RenameIndex(
                name: "IX_epi_Nome",
                table: "epis",
                newName: "IX_epis_Nome");

            migrationBuilder.RenameIndex(
                name: "IX_epi_CategoriaEpiId",
                table: "epis",
                newName: "IX_epis_CategoriaEpiId");

            migrationBuilder.RenameIndex(
                name: "IX_epi_Ca_Fabricante",
                table: "epis",
                newName: "IX_epis_Ca_Fabricante");

            migrationBuilder.AddPrimaryKey(
                name: "PK_epis",
                table: "epis",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_epi_atributos_tecnicos_epis_EpiId",
                table: "epi_atributos_tecnicos",
                column: "EpiId",
                principalTable: "epis",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_epis_categorias_epi_CategoriaEpiId",
                table: "epis",
                column: "CategoriaEpiId",
                principalTable: "categorias_epi",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
