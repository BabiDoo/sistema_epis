using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEpis.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoriaEpi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categorias_epi",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Ativa = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categorias_epi", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "epis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Fabricante = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    CertificadoAprovacao = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ValidadeCA = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DiasDurabilidadePadrao = table.Column<int>(type: "integer", nullable: false),
                    FotoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CategoriaEpiId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_epis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_epis_categorias_epi_CategoriaEpiId",
                        column: x => x.CategoriaEpiId,
                        principalTable: "categorias_epi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "epi_atributos_tecnicos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Valor = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EpiId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_epi_atributos_tecnicos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_epi_atributos_tecnicos_epis_EpiId",
                        column: x => x.EpiId,
                        principalTable: "epis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_categorias_epi_Nome",
                table: "categorias_epi",
                column: "Nome",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_epi_atributos_tecnicos_EpiId",
                table: "epi_atributos_tecnicos",
                column: "EpiId");

            migrationBuilder.CreateIndex(
                name: "IX_epi_atributos_tecnicos_Nome",
                table: "epi_atributos_tecnicos",
                column: "Nome");

            migrationBuilder.CreateIndex(
                name: "IX_epis_CategoriaEpiId",
                table: "epis",
                column: "CategoriaEpiId");

            migrationBuilder.CreateIndex(
                name: "IX_epis_CertificadoAprovacao_Fabricante",
                table: "epis",
                columns: new[] { "CertificadoAprovacao", "Fabricante" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_epis_Nome",
                table: "epis",
                column: "Nome");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "epi_atributos_tecnicos");

            migrationBuilder.DropTable(
                name: "epis");

            migrationBuilder.DropTable(
                name: "categorias_epi");
        }
    }
}
