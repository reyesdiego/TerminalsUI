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

	function CheckPageBreak($h)
	{
		//If the height h would cause an overflow, add a new page immediately
		if($this->GetY()+$h>$this->PageBreakTrigger)
			$this->AddPage($this->CurOrientation);
	}

	function NbLines($w, $txt)
	{
		//Computes the number of lines a MultiCell of width w will take
		$cw=&$this->CurrentFont['cw'];
		if($w==0)
			$w=$this->w-$this->rMargin-$this->x;
		$wmax=($w-2*$this->cMargin)*1000/$this->FontSize;
		$s=str_replace("\r", '', $txt);
		$nb=strlen($s);
		if($nb>0 and $s[$nb-1]=="\n")
			$nb--;
		$sep=-1;
		$i=0;
		$j=0;
		$l=0;
		$nl=1;
		while($i<$nb)
		{
			$c=$s[$i];
			if($c=="\n")
			{
				$i++;
				$sep=-1;
				$j=$i;
				$l=0;
				$nl++;
				continue;
			}
			if($c==' ')
				$sep=$i;
			$l+=$cw[$c];
			if($l>$wmax)
			{
				if($sep==-1)
				{
					if($i==$j)
						$i++;
				}
				else
					$i=$sep+1;
				$sep=-1;
				$j=$i;
				$l=0;
				$nl++;
			}
			else
				$i++;
		}
		return $nl;
	}
}

$data = get_post();
$id = $data['id'];
$fecha = date('d/m/Y', strtotime($data['fecha']));
$hoy = date('d/m/Y', strtotime($data['hoy']));

switch ($data['tipo']){
	case 'date':
		$tipo = "Diario";
		break;
	case 'month':
		$tipo = "Mensual";
		break;
	case 'year':
		$tipo = "Anual";
		break;
}

$acumTasa = 0;
$acumTotal = 0;

crear_archivos_graficos($data['charts'], $id);

$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(190, 8, "Tipo de reporte: " . $tipo . " - Fecha: " . $fecha, 0, 0);
$pdf->Ln();
$pdf->Cell(190, 8, utf8_decode("Generado el día: " . $hoy), 0, 0);
$pdf->Ln();

$pdf->SetFont('Arial', 'B', 9);

$pdf->Cell(18, 8, "Terminal", 1, 0, "C");
$pdf->Cell(13, 8, utf8_decode("Código"), 1, 0, "C");
$pdf->Cell(36, 8, utf8_decode("Descripción"), 1, 0, "L");
$pdf->Cell(18, 8, "Toneladas", 1, 0, "R");
$pdf->Cell(22, 8, "Tasa", 1, 0, "R");
$pdf->Cell(22, 8, "Importe", 1, 0, "R");

$pdf->Image(".temp/2" . $id . ".jpg", 141, 45, 72);
$pdf->Ln();

foreach($data['rates'] as $rate){
	$pdf->SetFont('Arial', '', 8);

	//Calculate the height of the row
	$nb=0;
	$nb=$pdf->NbLines(36, $rate['descripcion']);
	$h=5*$nb;
	//Issue a page break first if needed
	$pdf->CheckPageBreak($h);

	$pdf->setX(41);

	$x=$pdf->GetX();
	$y=$pdf->GetY();

	$pdf->MultiCell(36, 5, utf8_decode($rate['descripcion']), 1, "L");

	$h = $pdf->getY();

	$pdf->setXY(10, $y);
	$pdf->Cell(18, $h - $y, $rate['terminal'], 1, 0, "C");
	$pdf->Cell(13, $h - $y, $rate['code'], 1, 0, "C");
	$pdf->setX(77);

	$pdf->Cell(18, $h - $y, number_format($rate['ton'], 2), 1, 0, "R");
	if ($data['tasaAgp']){
		$pdf->Cell(22, $h - $y, "US$ " . number_format($rate['totalAgp'], 2), 1, 0, "R");
		$pdf->Cell(22, $h - $y, "$ " . number_format($rate['totalPesoAgp'], 2), 1, 0, "R");
		$acumTasa += $rate['totalAgp'];
		$acumTotal += $rate['totalPesoAgp'];
	} else {
		$pdf->Cell(22, $h - $y, "US$ " . number_format($rate['total'], 2), 1, 0, "R");
		$pdf->Cell(22, $h - $y, "$ " . number_format($rate['totalPeso'], 2), 1, 0, "R");
		$acumTasa += $rate['total'];
		$acumTotal += $rate['totalPeso'];
	}

	$pdf->Ln();
}

$pdf->Cell(85, 5, "Total", 1, 0, "R");
$pdf->Cell(22, 5, "US$ " . number_format($acumTasa, 2), 1, 0, "R");
$pdf->Cell(22, 5, "$ " . number_format($acumTotal, 2), 1, 0, "R");
$pdf->Ln(10);

$pdf->SetFont('Arial', 'B', 9);
$y=$pdf->GetY();
$pdf->Cell(40, 5, "", 1, 0);
$pdf->Ln();
$pdf->Cell(40, 5, "Total", 1, 0, "R");

$acumWidth = 0;
foreach($data['totales'] as $totalTerminal){
	$pdf->SetFont('Arial', 'B', 9);
	$pdf->SetY($y);
	$pdf->SetX(50 + $acumWidth);
	$pdf->Cell(50, 5, $totalTerminal[0], 1, 0, "R");
	$pdf->SetFont('Arial', '', 8);
	$pdf->SetY($y + 5);
	$pdf->SetX(50 + $acumWidth);
	$pdf->Cell(50, 5, "$ " . number_format($totalTerminal[1], 2), 1, 0, "R");
	$acumWidth += 50;
}
$pdf->Ln();

$h = getChartHeigth($data['charts'][0], 220);

$pdf->CheckPageBreak($h);

$pdf->Image(".temp/1" . $id . ".jpg", $pdf->GetX()-10, $pdf->GetY() + 2, 220);

$pdf->SetY($pdf->GetY() + 2 + $h);

if ($data['detalle']){
	$h = getChartHeigth($data['charts'][2], 80);

	$pdf->CheckPageBreak($h);

	$pdf->Image(".temp/3" . $id . ".jpg", $pdf->GetX() + 10, $pdf->GetY() + 2, 80);
	$pdf->Image(".temp/4" . $id . ".jpg", 120, $pdf->GetY() + 2, 80);
}

borrar_archivos_graficos($data['charts'], $id);

$pdf->Output();