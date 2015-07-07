<?php

include_once 'pdf/fpdf.php';
include_once 'util.php';

class PDF extends FPDF
{
	function Header()
	{
		//Logo
		$this->Image('imagenes/logo.jpg',10,8,40);
		//Arial bold 15
		$this->SetFont('Arial','B',15);
		//Movernos a la derecha

		//Título
		$this->SetX(50);
		$this->Cell(150,10,urldecode(em('Sistema de Control de Terminales')),0,0,'C');
		$this->Ln();
		$this->SetX(50);
		$this->Cell(150,10,urldecode(em('Impresión de comprobantes')),0,0,'C');
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
		$this->Cell(20,10,'Pagina '.$this->PageNo().'/{nb}',0,0,'L');
		$this->Cell(170, 10, urldecode(em("Administración General de Puertos S.E. - Departamento de Desarrollo")), 0, 0, "R");
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

$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 15);

switch ($data['terminal']){
	case 'BACTSSA':
		$pdf->Image('imagenes/logo_bactssa.jpg', $pdf->GetX(), $pdf->GetY() + 2, 40);
		break;
	case 'TERMINAL4':
		$pdf->Image('imagenes/logo_terminal4.jpg', $pdf->GetX() + 4, $pdf->GetY() + 5, 40);
		break;
	case 'TRP':
		$pdf->Image('imagenes/logo_trp.jpg', $pdf->GetX() + 4, $pdf->GetY() + 5, 40);
		break;
}

$pdf->Cell(0, 8, $data['codTipoComprob'], "TLR", 0, "C");
$pdf->Ln();

$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 8, urldecode(em("Número: ")) . $data['nroComprob'], "LR", 0, "C");
$pdf->Ln();

$pdf->SetFont('Arial', '', 10);
$pdf->Cell(0, 5, "Terminal: " . $data['terminal'], "LR", 0, "C");
$pdf->Ln();
$pdf->Cell(0, 5, "Punto de venta: " . $data['nroPtoVenta'], "LR", 0, "C");
$pdf->Ln();
$pdf->Cell(0, 5, urldecode(em("Emisión: ")) . $data['fecha']['emision'], "LRB", 0, "C");
$pdf->Ln();

$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(0, 8, urldecode(em("Razón Social: ")) . $data['razon'], "LR", 0, "C");
$pdf->Ln();
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(0, 5, "Documento cliente: " . $data['nroDoc'] . " - Vencimiento factura: " . $data['fecha']['vcto'], "LRB", 0, "C");
$pdf->Ln();
$pdf->Cell(0, 8, "Desde: " . $data['fecha']['desde'] . " - Hasta: " . $data['fecha']['hasta'], "LRB", 0, "C");
$pdf->Ln();
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(0, 8, "Detalle", "LRB", 0, "C");
$pdf->Ln();
$pdf->Cell(15, 8, urldecode(em("Ítem")), "LRB", 0, "R");
$pdf->Cell(80, 8, urldecode(em("Descripcion")), "LRB", 0, "C");
$pdf->Cell(20, 8, "Cantidad", "LRB", 0, "C");
$pdf->Cell(30, 8, "Precio Unitario", "LRB", 0, "C");
$pdf->Cell(15, 8, "Unidad", "LRB", 0, "C");
$pdf->Cell(30, 8, "Total", "LRB", 0, "R");
$pdf->Ln();

foreach ($data['detalle'] as $detalle) {
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 8, '', "LRB", 0, "L");
	$pdf->SetX(10);
	$pdf->Write(8, "Contenedor: " . $detalle['contenedor']);
	$pdf->SetFont('Arial', '', 10);
	$pdf->Write(8, " - Buque: (" . $detalle['buque']['codigo'] . ") " . $detalle['buque']['nombre'] . " - Viaje: " . $detalle['buque']['viaje'] . " - Fecha: " . $detalle['buque']['fecha']);
	$pdf->Ln();
	foreach ($detalle['items'] as $item){

		//Calculate the height of the row
		$nb=0;
		$nb=$pdf->NbLines(80, $item['descripcion']);
		$h=5*$nb;
		//Issue a page break first if needed
		$pdf->CheckPageBreak($h);

		$pdf->setX(25);

		$x=$pdf->GetX();
		$y=$pdf->GetY();

		$item['descripcion'] = em($item['descripcion']);
		$pdf->MultiCell(80, 5, urldecode($item['descripcion']), "TLRB", "L");

		$h = $pdf->getY();

		$pdf->setXY(10, $y);
		$pdf->Cell(15, $h - $y, $item['id'], 1, 0, "R");
		$pdf->setX(105);
		$pdf->Cell(20, $h - $y, $item['cnt'], 1, 0, "R");
		$pdf->Cell(30, $h - $y, "US$ " . number_format($item['impUnit'], 2), 1, 0, "R");
		$pdf->Cell(15, $h - $y, $item['uniMed'], 1, 0, "R");
		$pdf->Cell(30, $h - $y, "US$ " . number_format($item['impTot'], 2), 1, 0, "R");
		$pdf->Ln();
	}

}

$pdf->Cell(115, 8, "Subtotal", "LRB", 0, "R");
$pdf->Cell(75, 8, "US$ " . number_format($data['importe']['subtotal'], 2), "LRB", 0, "R");
$pdf->Ln();
$pdf->Cell(115, 8, "I.V.A.", "LRB", 0, "R");
$pdf->Cell(75, 8, "US$ " . number_format($data['importe']['iva'], 2), "LRB", 0, "R");
$pdf->Ln();
if (isset($data['importe']['otrosTributos'])){
	$pdf->Cell(115, 8, "Otros Tributos", "LRB", 0, "R");
	$pdf->Cell(75, 8, "US$ " . number_format($data['importe']['otrosTributos'], 2), "LRB", 0, "R");
	$pdf->Ln();
}
$pdf->Cell(115, 8, "Total", "LRB", 0, "R");
$pdf->Cell(75, 8, "US$ " . number_format($data['importe']['total'], 2), "LRB", 0, "R");
$pdf->SetFont('Arial', '', 8);
$pdf->Ln();
$pdf->Cell(0, 8, "Monto Gravado US$ " . number_format($data['importe']['gravado'], 2) . " | Monto No Gravado US$ " . number_format($data['importe']['noGravado'], 2) . " | Excento US$ " . number_format($data['importe']['exento'], 2) . " | " . urldecode(em("Cotización Moneda US$ 1 = $ ")) . $data['cotiMoneda'], "LRB", 0, "C");
$pdf->Ln();
if (isset($data['observa'])){
	$pdf->Cell(0, 8, "Observaciones: " . $data['observa'], "LRB", 0, "C");
}

$pdf->Output();