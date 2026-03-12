using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEpis.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddOrganizacaoBase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "cargos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Codigo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cargos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "unidades",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Codigo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    Ativa = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_unidades", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "areas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Ativa = table.Column<bool>(type: "boolean", nullable: false),
                    UnidadeId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_areas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_areas_unidades_UnidadeId",
                        column: x => x.UnidadeId,
                        principalTable: "unidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "setores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    AreaId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_setores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_setores_areas_AreaId",
                        column: x => x.AreaId,
                        principalTable: "areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "colaboradores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NomeCompleto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Matricula = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Cpf = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: true),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    UnidadeId = table.Column<Guid>(type: "uuid", nullable: false),
                    AreaId = table.Column<Guid>(type: "uuid", nullable: false),
                    SetorId = table.Column<Guid>(type: "uuid", nullable: false),
                    CargoId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_colaboradores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_colaboradores_areas_AreaId",
                        column: x => x.AreaId,
                        principalTable: "areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_colaboradores_cargos_CargoId",
                        column: x => x.CargoId,
                        principalTable: "cargos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_colaboradores_setores_SetorId",
                        column: x => x.SetorId,
                        principalTable: "setores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_colaboradores_unidades_UnidadeId",
                        column: x => x.UnidadeId,
                        principalTable: "unidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_colaboradores_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_areas_UnidadeId_Nome",
                table: "areas",
                columns: new[] { "UnidadeId", "Nome" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_cargos_Codigo",
                table: "cargos",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_cargos_Nome",
                table: "cargos",
                column: "Nome");

            migrationBuilder.CreateIndex(
                name: "IX_colaboradores_AreaId",
                table: "colaboradores",
                column: "AreaId");

            migrationBuilder.CreateIndex(
                name: "IX_colaboradores_CargoId",
                table: "colaboradores",
                column: "CargoId");

            migrationBuilder.CreateIndex(
                name: "IX_colaboradores_Cpf",
                table: "colaboradores",
                column: "Cpf",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_colaboradores_Matricula",
                table: "colaboradores",
                column: "Matricula",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_colaboradores_SetorId",
                table: "colaboradores",
                column: "SetorId");

            migrationBuilder.CreateIndex(
                name: "IX_colaboradores_UnidadeId",
                table: "colaboradores",
                column: "UnidadeId");

            migrationBuilder.CreateIndex(
                name: "IX_colaboradores_UsuarioId",
                table: "colaboradores",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_setores_AreaId_Nome",
                table: "setores",
                columns: new[] { "AreaId", "Nome" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_unidades_Codigo",
                table: "unidades",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_unidades_Nome",
                table: "unidades",
                column: "Nome");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "colaboradores");

            migrationBuilder.DropTable(
                name: "cargos");

            migrationBuilder.DropTable(
                name: "setores");

            migrationBuilder.DropTable(
                name: "areas");

            migrationBuilder.DropTable(
                name: "unidades");
        }
    }
}
