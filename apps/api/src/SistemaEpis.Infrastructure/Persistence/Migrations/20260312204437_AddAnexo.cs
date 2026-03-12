using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEpis.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAnexo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "anexo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Tipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UrlStorage = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    EntidadeTipo = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    EntidadeId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: true),
                    NomeOriginal = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ContentType = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    TamanhoBytes = table.Column<long>(type: "bigint", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_anexo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_anexo_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_anexo_EntidadeTipo_EntidadeId",
                table: "anexo",
                columns: new[] { "EntidadeTipo", "EntidadeId" });

            migrationBuilder.CreateIndex(
                name: "IX_anexo_Tipo",
                table: "anexo",
                column: "Tipo");

            migrationBuilder.CreateIndex(
                name: "IX_anexo_UsuarioId",
                table: "anexo",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "anexo");
        }
    }
}
