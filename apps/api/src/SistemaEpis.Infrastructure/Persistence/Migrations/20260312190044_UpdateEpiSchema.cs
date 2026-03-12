using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEpis.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEpiSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_epis_CertificadoAprovacao_Fabricante",
                table: "epis");

            migrationBuilder.DropColumn(
                name: "CertificadoAprovacao",
                table: "epis");

            migrationBuilder.RenameColumn(
                name: "ValidadeCA",
                table: "epis",
                newName: "ValidadeCa");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "ValidadeCa",
                table: "epis",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "Nome",
                table: "epis",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Fabricante",
                table: "epis",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(150)",
                oldMaxLength: 150,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ca",
                table: "epis",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_epis_Ca_Fabricante",
                table: "epis",
                columns: new[] { "Ca", "Fabricante" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_epis_Ca_Fabricante",
                table: "epis");

            migrationBuilder.DropColumn(
                name: "Ca",
                table: "epis");

            migrationBuilder.RenameColumn(
                name: "ValidadeCa",
                table: "epis",
                newName: "ValidadeCA");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ValidadeCA",
                table: "epis",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<string>(
                name: "Nome",
                table: "epis",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(150)",
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<string>(
                name: "Fabricante",
                table: "epis",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(150)",
                oldMaxLength: 150);

            migrationBuilder.AddColumn<string>(
                name: "CertificadoAprovacao",
                table: "epis",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_epis_CertificadoAprovacao_Fabricante",
                table: "epis",
                columns: new[] { "CertificadoAprovacao", "Fabricante" },
                unique: true);
        }
    }
}
