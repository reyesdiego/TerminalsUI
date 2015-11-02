<?php

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
		$this->Cell(110,10,utf8_decode('Reporte de Tasas a las Cargas'),0,0,'C');

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

}

$data = get_post();
$contarGraficos = 0;
$id = $data['id'];

foreach ($data['charts'] as $chart) {

	$contarGraficos++;
	$chart['image'] = substr($chart['image'], 1+strrpos($chart['image'], ','));
	$chart['image'] = base64_decode($chart['image']);

	file_put_contents($chart['filename'] . $id . ".jpeg", $chart);
}


$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 12);

$pdf->Image(".temp/grafico1.jpeg", 50, 50, 100);

$pdf->Output();