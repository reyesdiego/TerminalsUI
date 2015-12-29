<?php
/**
 * Created by PhpStorm.
 * User: artiom
 * Date: 29/12/15
 * Time: 13:52
 */

include_once 'pdf/fpdf.php';
include_once 'util.php';

class PDF extends FPDF
{
	var $terminal;

	function setTerminal($unaTerminal){
		$this->terminal = $unaTerminal;
	}

	function Header()
	{
		//Logo
		$this->Image('imagenes/logo.jpg',10,8,40);
		//Arial bold 15
		$this->SetFont('Arial','B',16);
		//Movernos a la derecha

		//Título
		$this->SetX(50);
		$this->Cell(110,10,utf8_decode('Sistema de Control de Terminales'),0,0,'C');
		$this->Ln();
		$this->SetX(50);
		$this->Cell(110,10,utf8_decode('Reporte de Tarifas'),0,0,'C');

		//Salto de línea
		$this->Ln(15);
	}

	function Footer()
	{
		//Posición: a 1,5 cm del final
		$this->SetY(-15);
		$y = $this->GetY();
		$this->Line(10, $y, 200, $y);
		//Arial italic 8
		$this->SetFont('Arial','I',8);
		//Número de página
		$this->Cell(20,10,utf8_decode('Página ').$this->PageNo().'/{nb}',0,0,'L');
		$this->Cell(165, 10, utf8_decode("Administración General de Puertos S.E. - Departamento de Desarrollo"), 0, 0, "R");
		$this->Image("imagenes/logo_puertochico.jpg", $this->GetX(), $this->GetY() + 2, 5);
	}

	function CheckPageBreak($h)
	{
		//If the height h would cause an overflow, add a new page immediately
		if($this->GetY()+$h>$this->PageBreakTrigger)
			$this->AddPage($this->CurOrientation);
	}
}

$data = get_post();
$id = $data['id'];
$año = $data['anio'];
$hoy = date('d/m/Y', strtotime($data['hoy']));

$valorMat = $data['matData']['valorMAT'];
$dataFacturado = $data['matData']['dataFacturado'];

crear_archivos_graficos($data['charts'], $id);

$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(190, 8, utf8_decode('Reporte generado el ' . $hoy), 0, "L");
$pdf->Ln();

$pdf->Cell(25, 8, utf8_decode("Año"), 1, 0, "C");
$pdf->Cell(55, 8, "BACTSSA", 1, 0, "R");
$pdf->Cell(55, 8, "TERMINAL 4", 1, 0, "R");
$pdf->Cell(55, 8, "TRP", 1, 0, "R");

$pdf->Ln();

$pdf->SetFont('Arial', '', 11);
$pdf->Cell(25, 8, $año, 1, 0, "C");
$pdf->Cell(55, 8, "US$ " . number_format($valorMat['BACTSSA'], 2), 1, 0, "R");
$pdf->Cell(55, 8, "US$ " . number_format($valorMat['TERMINAL4'], 2), 1, 0, "R");
$pdf->Cell(55, 8, "US$ " . number_format($valorMat['TRP'], 2), 1, 0, "R");

$pdf->Ln(12);

$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(25, 16, "Mes", 1, 0, "C");
$pdf->Cell(55, 8, "BACTSSA", 1, 0, "C");
$pdf->Cell(55, 8, "TERMINAL 4", 1, 0, "C");
$pdf->Cell(55, 8, "TRP", 1, 0, "C");

$pdf->Ln(8);

$pdf->SetX(35);

for ( $i = 0; $i <= 2; $i++){
	$pdf->Cell(27.5, 8, "Facturado", 1, 0, "R");
	$pdf->Cell(27.5, 8, "Diferencia", 1, 0, "R");
}

$pdf->Ln();

$pdf->SetFont('Arial', '', 8);
while ($datosMAT = current($dataFacturado)){
	$pdf->Cell(25, 8, key($dataFacturado), 1, 0, "C");
	$pdf->Cell(27.5, 8, "US$ " . number_format($datosMAT['facturado']['BACTSSA'], 2), 1, 0, "R");
	$pdf->Cell(27.5, 8, "US$ " . number_format($datosMAT['diferencia']['BACTSSA'], 2), 1, 0, "R");
	$pdf->Cell(27.5, 8, "US$ " . number_format($datosMAT['facturado']['TERMINAL4'], 2), 1, 0, "R");
	$pdf->Cell(27.5, 8, "US$ " . number_format($datosMAT['diferencia']['TERMINAL4'], 2), 1, 0, "R");
	$pdf->Cell(27.5, 8, "US$ " . number_format($datosMAT['facturado']['TRP'], 2), 1, 0, "R");
	$pdf->Cell(27.5, 8, "US$ " . number_format($datosMAT['diferencia']['TRP'], 2), 1, 0, "R");
	$pdf->Ln();
	next($dataFacturado);
}

$pdf->Ln();

$pdf->Image(".temp/1" . $id . ".jpg", $pdf->GetX(), $pdf->GetY(), 110);
$pdf->Image(".temp/2" . $id . ".jpg", 110, $pdf->GetY(), 110);

borrar_archivos_graficos($data['charts'], $id);

$pdf->Output();